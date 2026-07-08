import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { products } from '@/data/products'
import { sealedProducts } from '@/data/sealed'
import { sealedFrProducts } from '@/data/sealed-fr'
import { stockStore } from '@/lib/stock-store'

interface CustomerInfo {
  prenom: string
  nom: string
  email: string
  telephone: string
  adresse: string
  complement: string
  codePostal: string
  ville: string
  pays: string
}

// ── Rate limiting simple (en mémoire, reset au redémarrage) ──────────────────
const rateMap = new Map<string, { count: number; ts: number }>()
const RATE_WINDOW_MS = 60_000 // 1 minute
const RATE_MAX       = 10     // max 10 requêtes / minute / IP

function isRateLimited(ip: string): boolean {
  const now  = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now - entry.ts > RATE_WINDOW_MS) {
    rateMap.set(ip, { count: 1, ts: now })
    return false
  }
  if (entry.count >= RATE_MAX) return true
  entry.count++
  return false
}

// ── Handler principal ────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
           ?? request.headers.get('x-real-ip')
           ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez patienter une minute.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { items, customer, couponCode, shippingMethod }: {
      items: { productId: string; quantity: number }[]
      customer?: CustomerInfo
      couponCode?: string
      shippingMethod?: 'relay' | 'home' | 'international'
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // ── Validation & récupération des prix côté serveur ──────────────────────
    // On ignore totalement les prix envoyés par le front.
    // On relit chaque produit depuis products.ts ou sealed.ts (source de vérité).
    const allProducts = [...products, ...sealedProducts, ...sealedFrProducts]
    const resolvedItems: { product: typeof allProducts[0]; quantity: number }[] = []

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity < 1) {
        return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
      }
      const product = allProducts.find(p => p.id === item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable : ${item.productId}` },
          { status: 400 }
        )
      }
      // Vérifier le stock réel (inclut les ventes déjà enregistrées)
      const effectiveStock = stockStore.getStock(product.id)
      if (effectiveStock <= 0) {
        return NextResponse.json(
          { error: `"${product.name}" est épuisé.` },
          { status: 400 }
        )
      }
      resolvedItems.push({ product, quantity: Math.min(item.quantity, effectiveStock) })
    }

    // ── Calcul du total et de la livraison (serveur) ─────────────────────────
    const SHIPPING_COSTS = {
      relay:         { price: 4.99,  label: 'Mondial Relay — Point Relais',      desc: 'France · 3–5 jours ouvrés' },
      home:          { price: 7.99,  label: 'Colissimo — Livraison à domicile',   desc: 'France · 2–3 jours ouvrés' },
      international: { price: 24.99, label: 'Livraison Internationale',           desc: 'Europe, USA · 7–14 jours ouvrés' },
    } as const
    // Validation runtime — rejette toute valeur non autorisée (ex: injection "gratuit")
    const VALID_METHODS = ['relay', 'home', 'international'] as const
    type ValidMethod = typeof VALID_METHODS[number]
    const resolvedMethod: ValidMethod = VALID_METHODS.includes(shippingMethod as ValidMethod)
      ? (shippingMethod as ValidMethod)
      : 'relay'
    const selectedShipping = SHIPPING_COSTS[resolvedMethod]
    // Utiliser l'origin de la requête pour que les redirects Stripe
    // pointent toujours vers le bon domaine (prod, preview Vercel, localhost…)
    const siteUrl = request.headers.get('origin')
                 ?? process.env.NEXT_PUBLIC_SITE_URL
                 ?? 'http://localhost:3000'
    const subtotal = resolvedItems.reduce((s, i) => s + i.product.price * i.quantity, 0)
    const FREE_SHIPPING_THRESHOLD = 50
    const isFranceMethod = resolvedMethod === 'relay' || resolvedMethod === 'home'
    const shippingFree = isFranceMethod && subtotal >= FREE_SHIPPING_THRESHOLD
    const shippingPrice = shippingFree ? 0 : selectedShipping.price
    const shippingLabel = shippingFree ? `${selectedShipping.label} — Offerte` : selectedShipping.label

    // ── Line items Stripe ────────────────────────────────────────────────────
    const lineItems = resolvedItems.map(({ product, quantity }) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name:        `${product.name} — ${product.set}`,
          description: `${product.rarity} · ${product.condition} · ${product.number}`,
          images:      [product.imageUrl],
          metadata:    { productId: product.id },
        },
        unit_amount: Math.round(product.price * 100), // prix serveur, pas celui du front
      },
      quantity,
    }))

    lineItems.push({
      price_data: {
        currency:     'eur',
        product_data: {
          name:        shippingLabel,
          description: shippingFree
            ? 'Livraison offerte en France à partir de 50 € — France uniquement'
            : selectedShipping.desc,
          images:      [],
          metadata:    { productId: '__shipping__' },
        },
        unit_amount: Math.round(shippingPrice * 100), // 0 si gratuit — s'affiche "Livraison offerte" dans Stripe
      },
      quantity: 1,
    })

    // ── Code promo ───────────────────────────────────────────────────────────
    let discounts: { promotion_code: string }[] | undefined
    if (couponCode) {
      const promoCodes = await stripe.promotionCodes.list({ code: couponCode, active: true, limit: 1 })
      if (promoCodes.data.length > 0) {
        discounts = [{ promotion_code: promoCodes.data[0].id }]
      }
    }

    // ── Session Stripe ───────────────────────────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items:           lineItems,
      mode:                 'payment',
      customer_email:       customer?.email || undefined,
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      success_url:          `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:           `${siteUrl}/panier`,
      locale:               'fr',
      metadata: {
        // IDs des produits commandés (pour le webhook)
        productIds: resolvedItems.map(i => `${i.product.id}:${i.quantity}`).join(','),
        // Infos client
        ...(customer ? {
          prenom:     customer.prenom,
          nom:        customer.nom,
          telephone:  customer.telephone || '',
          adresse:    customer.adresse,
          complement: customer.complement || '',
          codePostal: customer.codePostal,
          ville:      customer.ville,
          pays:       customer.pays,
        } : {}),
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error('[checkout]', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
