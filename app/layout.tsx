import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartProvider from '@/components/CartProvider'
import CookieBanner from '@/components/CookieBanner'

export const metadata: Metadata = {
  title: {
    default: 'PokeJap — Cartes Pokémon Japonaises',
    template: '%s — PokeJap',
  },
  description: 'Boutique spécialisée en singles Pokémon japonais et français. Cartes authentiques importées directement du Japon : AR, SAR, ex, CHR et plus encore.',
  keywords: ['pokémon', 'cartes japonaises', 'singles pokémon', 'pokémon TCG', 'AR card', 'SAR', 'pokémon japon', 'pokejap'],
  openGraph: {
    title: 'PokeJap — Cartes Pokémon Japonaises',
    description: 'Singles Pokémon japonais et français importés directement du Japon. AR, SAR, ex, CHR…',
    url: 'https://pokejap.fr',
    siteName: 'PokeJap',
    locale: 'fr_FR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#0A0A14] text-white antialiased">
        <CartProvider>
          <Navbar />
          <main className="pt-0 min-h-screen">{children}</main>
          <Footer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  )
}
