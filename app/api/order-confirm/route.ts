import { NextRequest, NextResponse } from 'next/server'
import { sendOrderEmails } from '@/lib/order-email'

// Filet de sécurité : appelé par la page /checkout/success.
// Si le webhook Stripe a déjà envoyé les e-mails, rien n'est renvoyé.
export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()
    if (typeof sessionId !== 'string' || !/^cs_(live|test)_[A-Za-z0-9]+$/.test(sessionId)) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 400 })
    }
    const status = await sendOrderEmails(sessionId)
    return NextResponse.json({ status })
  } catch (err: any) {
    console.error('[order-confirm]', err?.message ?? err)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
