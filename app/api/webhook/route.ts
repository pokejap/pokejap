import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { stockStore } from '@/lib/stock-store'
import Stripe from 'stripe'

// Stripe envoie le body en raw — ne pas parser en JSON avant la vérification
export const config = { api: { bodyParser: false } }

export async function POST(request: NextRequest) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('[webhook] Signature invalide:', err.message)
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  // ── Paiement confirmé ────────────────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Récupérer les productIds depuis les metadata
    const productIds = session.metadata?.productIds
    if (productIds) {
      // Format: "sv11w-093:1,sv9-122:2"
      const entries = productIds.split(',')
      for (const entry of entries) {
        const [productId, qtyStr] = entry.split(':')
        const qty = parseInt(qtyStr ?? '1', 10)
        if (productId && !isNaN(qty)) {
          stockStore.decrement(productId, qty)
        }
      }
    }

    console.log(
      `[webhook] Commande payée — session ${session.id}`,
      `| Client: ${session.customer_email ?? 'inconnu'}`,
      `| Total: ${((session.amount_total ?? 0) / 100).toFixed(2)} €`
    )
  }

  return NextResponse.json({ received: true })
}
