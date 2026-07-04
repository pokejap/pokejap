import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { prenom, nom, email } = await request.json()

    const transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 465,
      secure: true,
      auth: {
        user: 'contact@pokemon-cartes.fr',
        pass: process.env.SMTP_PASS,
      },
    })

    // ── 1. Notif admin ────────────────────────────────────────────────────────
    await transporter.sendMail({
      from: '"PokeJap" <contact@pokemon-cartes.fr>',
      to: 'contact@pokemon-cartes.fr',
      subject: '🎉 Nouvelle inscription — PokeJap',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #DC2626;">Nouvelle inscription sur PokeJap</h2>
          <p><strong>Prénom :</strong> ${prenom}</p>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <hr/>
          <p style="color: #666; font-size: 12px;">Notification automatique — pokemon-cartes.fr</p>
        </div>
      `,
    })

    // ── 2. Mail de bienvenue au client ────────────────────────────────────────
    await transporter.sendMail({
      from: '"PokeJap 🎴" <contact@pokemon-cartes.fr>',
      to: email,
      subject: '🎉 Bienvenue sur PokeJap — ton code de réduction t\'attend !',
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d14;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#16162a;border-radius:16px;overflow:hidden;border:1px solid #2a2a3e;">

          <!-- Header rouge -->
          <tr>
            <td style="background:#DC2626;padding:28px 40px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                PokeJap<span style="color:#FFD600;">.</span>fr
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.75);letter-spacing:3px;text-transform:uppercase;">
                Imports Pokémon Japonais
              </p>
            </td>
          </tr>

          <!-- Corps -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">
                Bienvenue ${prenom} ! 👋
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#9898b8;line-height:1.6;">
                Ton compte PokeJap est créé. Merci de nous faire confiance pour tes imports Pokémon japonais — on va pas te décevoir. 🇯🇵
              </p>

              <!-- Bloc code promo -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e1e35;border:2px dashed #DC2626;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="margin:0 0 6px;font-size:12px;color:#9898b8;text-transform:uppercase;letter-spacing:2px;">
                      🎁 Ton cadeau de bienvenue
                    </p>
                    <p style="margin:0 0 10px;font-size:36px;font-weight:900;color:#FFD600;letter-spacing:4px;">
                      BIENVENUE10
                    </p>
                    <p style="margin:0;font-size:13px;color:#DC2626;font-weight:700;">
                      −10% sur ta première commande
                    </p>
                    <p style="margin:6px 0 0;font-size:11px;color:#666688;">
                      Valable une fois · à saisir sur la page de paiement
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Comment l'utiliser -->
              <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#ffffff;">Comment utiliser ton code :</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #2a2a3e;">
                    <span style="color:#DC2626;font-weight:700;">1.</span>
                    <span style="color:#9898b8;font-size:13px;margin-left:8px;">Ajoute tes produits au panier sur pokejap.fr</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #2a2a3e;">
                    <span style="color:#DC2626;font-weight:700;">2.</span>
                    <span style="color:#9898b8;font-size:13px;margin-left:8px;">Clique sur "Commander" et remplis tes infos</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <span style="color:#DC2626;font-weight:700;">3.</span>
                    <span style="color:#9898b8;font-size:13px;margin-left:8px;">Saisis <strong style="color:#FFD600;">BIENVENUE10</strong> dans le champ code de réduction — la remise s'applique automatiquement</span>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="text-align:center;margin-top:32px;">
                <a href="https://pokejap.fr/scelles"
                   style="display:inline-block;background:#DC2626;color:#ffffff;font-weight:800;font-size:15px;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;">
                  Voir les produits →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0d14;padding:20px 40px;text-align:center;border-top:1px solid #2a2a3e;">
              <p style="margin:0;font-size:11px;color:#444466;line-height:1.6;">
                PokeJap · Imports Pokémon japonais authentiques · <a href="https://pokejap.fr" style="color:#DC2626;text-decoration:none;">pokejap.fr</a><br/>
                Des questions ? Réponds directement à cet email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email notification error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
