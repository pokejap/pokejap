import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartProvider from '@/components/CartProvider'
import CookieBanner from '@/components/CookieBanner'
import WelcomePopup from '@/components/WelcomePopup'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pokejap.fr'),
  verification: {
    google: 'zidWcWqO28miF2rADu6-iNq0ViUq63PC1xHU5UAWZf0',
  },
  title: {
    default: 'PokeJap — Cartes & Scellés Pokémon Japonais',
    template: '%s — PokeJap',
  },
  description: 'Boutique spécialisée en Pokémon japonais — singles authentiques (AR, SAR, ex, CHR) et produits scellés (displays, ETB, coffrets) importés directement du Japon. Sleeve et top loader inclus. Livraison rapide en France.',
  keywords: ['pokémon', 'cartes pokémon japonaises', 'singles pokémon', 'pokémon TCG japonais', 'AR card pokémon', 'SAR pokémon', 'display pokémon japonais', 'ETB pokémon japonais', 'produits scellés pokémon', 'acheter carte pokémon japon', 'pokejap', 'carte pokémon rare', 'CHR pokémon', 'boutique pokémon france'],
  openGraph: {
    title: 'PokeJap — Cartes & Scellés Pokémon Japonais',
    description: 'Singles Pokémon japonais (AR, SAR, ex, CHR) et produits scellés (displays, ETB, coffrets) importés directement du Japon. Sleeve et top loader inclus.',
    url: 'https://www.pokejap.fr',
    siteName: 'PokeJap',
    locale: 'fr_FR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-[#0A0A14] text-white antialiased">
        <CartProvider>
          <Navbar />
          <main className="pt-0 min-h-screen">{children}</main>
          <Footer />
          <CookieBanner />
          <WelcomePopup />
        </CartProvider>
      </body>
    </html>
  )
}
