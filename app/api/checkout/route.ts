import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { products } from '@/data/products'
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
    const { items, customer, couponCode }: {
      items: { productId: string; quantity: number }[]
      customer?: CustomerInfo
      couponCode?: string
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // ── Validation & récupération des prix côté serveur ──────────────────────
    // On ignore totalement les prix envoyés par le front.
    // On relit chaque produit depuis products.ts (source de vérité).
    const resolvedItems: { product: typeof products[0]; quantity: number }[] = []

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity < 1) {
        return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
      }
      const product = products.find(p => p.id === item.productId)
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
    const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const subtotal = resolvedItems.reduce((s, i) => s + i.product.price * i.quantity, 0)
    const shipping = 5.99

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
          name:        'Livraison Mondial Relay',
          description: 'Livraison en point relais 3–5 jours ouvrés',
          images:      [],
          metadata:    { productId: '__shipping__' },
        },
        unit_amount: Math.round(shipping * 100),
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
