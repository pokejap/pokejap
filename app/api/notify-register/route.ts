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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email notification error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
