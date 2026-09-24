import nodemailer from 'nodemailer'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'

const SHOP_EMAIL = 'contact@pokemon-cartes.fr'

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function euros(cents: number | null | undefined): string {
  return `${((cents ?? 0) / 100).toFixed(2).replace('.', ',')} €`
}

/**
 * Envoie les e-mails de commande (admin + client) pour une session Stripe payée.
 * Appelé par le webhook ET par la page de succès : un drapeau dans les
 * metadata Stripe (orderEmailSent) garantit qu'on n'envoie qu'une seule fois.
 */
export async function sendOrderEmails(sessionId: string): Promise<'sent' | 'already' | 'unpaid'> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  })

  if (session.payment_status !== 'paid') return 'unpaid'
  if (session.metadata?.orderEmailSent === '1') return 'already'

  // On "réserve" l'envoi tout de suite pour éviter un doublon webhook / page succès
  await stripe.checkout.sessions.update(session.id, {
    metadata: { orderEmailSent: '1' },
  })

  try {
    await deliver(session)
  } catch (err) {
    // Échec d'envoi : on libère le drapeau pour qu'une nouvelle tentative soit possible
    await stripe.checkout.sessions.update(session.id, {
      metadata: { orderEmailSent: '' },
    }).catch(() => {})
    throw err
  }
  return 'sent'
}

async function deliver(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {}
  const items = session.line_items?.data ?? []
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? ''
  const customerName = [m.prenom, m.nom].filter(Boolean).join(' ') || session.customer_details?.name || ''
  const ref = session.id.slice(-10).toUpperCase()
  const date = new Date(session.created * 1000).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })

  const rows = items.map(li => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a3e;color:#ffffff;font-size:14px;">
        ${esc(li.description)}
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a3e;color:#9898b8;font-size:14px;text-align:center;">×${li.quantity ?? 1}</td>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a3e;color:#ffffff;font-size:14px;text-align:right;">${euros(li.amount_total)}</td>
    </tr>`).join('')

  const discount = session.total_details?.amount_discount ?? 0
  const discountRow = discount > 0 ? `
    <tr>
      <td colspan="2" style="padding:8px 0;color:#9898b8;font-size:14px;">Réduction</td>
      <td style="padding:8px 0;color:#22c55e;font-size:14px;text-align:right;">−${euros(discount)}</td>
    </tr>` : ''

  const totalRow = `
    <tr>
      <td colspan="2" style="padding:12px 0 0;color:#ffffff;font-size:16px;font-weight:800;">Total payé</td>
      <td style="padding:12px 0 0;color:#FFD600;font-size:16px;font-weight:800;text-align:right;">${euros(session.amount_total)}</td>
    </tr>`

  const livraison = m.relayName
    ? `<strong>Point relais :</strong> ${esc(m.relayName)}<br/>${esc(m.relayAddress)}`
    : `<strong>Adresse :</strong> ${esc(m.adresse)}${m.complement ? ', ' + esc(m.complement) : ''}<br/>${esc(m.codePostal)} ${esc(m.ville)} — ${esc(m.pays)}`

  const layout = (title: string, body: string) => `
<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d14;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#16162a;border-radius:16px;overflow:hidden;border:1px solid #2a2a3e;">
        <tr><td style="background:#DC2626;padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:26px;font-weight:900;color:#ffffff;">PokeJap<span style="color:#FFD600;">.</span>fr</p>
          <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);">${title}</p>
        </td></tr>
        <tr><td style="padding:32px 40px;">${body}</td></tr>
        <tr><td style="background:#0d0d14;padding:18px 40px;text-align:center;border-top:1px solid #2a2a3e;">
          <p style="margin:0;font-size:11px;color:#666688;">PokeJap · <a href="https://pokejap.fr" style="color:#DC2626;text-decoration:none;">pokejap.fr</a> · Des questions ? Réponds à cet email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  const itemsTable = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 24px;">
      ${rows}${discountRow}${totalRow}
    </table>`

  const transporter = nodemailer.createTransport({
    host: 'ssl0.ovh.net',
    port: 465,
    secure: true,
    auth: { user: SHOP_EMAIL, pass: process.env.SMTP_PASS },
  })

  // ── 1. Notification pour toi ────────────────────────────────────────────────
  await transporter.sendMail({
    from: `"PokeJap" <${SHOP_EMAIL}>`,
    to: SHOP_EMAIL,
    replyTo: customerEmail || undefined,
    subject: `💰 Nouvelle commande ${euros(session.amount_total)} — ${customerName || customerEmail}`,
    html: layout('Nouvelle commande à expédier', `
      <p style="margin:0 0 4px;font-size:20px;font-weight:800;color:#ffffff;">Commande ${esc(ref)}</p>
      <p style="margin:0 0 16px;font-size:13px;color:#9898b8;">${esc(date)}</p>
      ${itemsTable}
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#ffffff;">Client</p>
      <p style="margin:0 0 20px;font-size:14px;color:#c8c8e0;line-height:1.6;">
        ${esc(customerName)}<br/>${esc(customerEmail)}${m.telephone ? '<br/>' + esc(m.telephone) : ''}
      </p>
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#ffffff;">Livraison</p>
      <p style="margin:0;font-size:14px;color:#c8c8e0;line-height:1.6;">${livraison}</p>
      <p style="margin:24px 0 0;font-size:11px;color:#666688;">Session Stripe : ${esc(session.id)}</p>
    `),
  })

  // ── 2. Confirmation pour le client ──────────────────────────────────────────
  if (customerEmail) {
    await transporter.sendMail({
      from: `"PokeJap 🎴" <${SHOP_EMAIL}>`,
      to: customerEmail,
      subject: `✅ Commande confirmée — PokeJap (réf. ${ref})`,
      html: layout('Confirmation de commande', `
        <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">Merci ${esc(m.prenom || '')} ! 🎉</p>
        <p style="margin:0 0 8px;font-size:15px;color:#9898b8;line-height:1.6;">
          Ta commande <strong style="color:#ffffff;">${esc(ref)}</strong> est bien confirmée et ton paiement validé.
          Tes cartes seront soigneusement emballées et expédiées sous 1 à 2 jours ouvrés.
          Tu recevras ton numéro de suivi par email dès l'envoi.
        </p>
        ${itemsTable}
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#ffffff;">Livraison</p>
        <p style="margin:0;font-size:14px;color:#c8c8e0;line-height:1.6;">${livraison}</p>
      `),
    })
  }
}
