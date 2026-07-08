import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()
    if (!email || !token) return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })

    const transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 465,
      secure: true,
      auth: {
        user: 'contact@pokemon-cartes.fr',
        pass: process.env.SMTP_PASS,
      },
    })

    const resetLink = `https://pokejap.fr/compte/reset?token=${token}&email=${encodeURIComponent(email)}`

    await transporter.sendMail({
      from: '"PokeJap 🎴" <contact@pokemon-cartes.fr>',
      to: email,
      subject: '🔑 Réinitialisation de ton mot de passe PokeJap',
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d14;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#16162a;border-radius:16px;overflow:hidden;border:1px solid #2a2a3e;">

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

          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">
                Réinitialisation de mot de passe 🔑
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#9898b8;line-height:1.6;">
                Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous — ce lien est valable <strong style="color:#ffffff;">1 heure</strong>.
              </p>

              <div style="text-align:center;margin-bottom:28px;">
                <a href="${resetLink}"
                   style="display:inline-block;background:#DC2626;color:#ffffff;font-weight:800;font-size:15px;padding:16px 40px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;">
                  Choisir un nouveau mot de passe →
                </a>
              </div>

              <p style="margin:0;font-size:12px;color:#444466;line-height:1.6;">
                Si tu n'es pas à l'origine de cette demande, ignore cet email — ton mot de passe reste inchangé.<br/>
                Ce lien expire dans 1 heure.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#0d0d14;padding:20px 40px;text-align:center;border-top:1px solid #2a2a3e;">
              <p style="margin:0;font-size:11px;color:#444466;">
                PokeJap · <a href="https://pokejap.fr" style="color:#DC2626;text-decoration:none;">pokejap.fr</a>
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
    console.error('Reset password email error:', error)
    return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 })
  }
}
