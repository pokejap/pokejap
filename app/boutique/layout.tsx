import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Boutique — Cartes Pokémon Japonaises',
  description: 'Achetez des singles Pokémon japonais et français : AR, SAR, ex, CHR, Full Art et plus. Cartes authentiques importées directement du Japon.',
  keywords: ['boutique pokémon', 'acheter carte pokémon', 'singles pokémon japonais', 'AR card', 'SAR pokémon', 'CHR pokémon', 'Full Art pokémon'],
  openGraph: {
    title: 'Boutique — Cartes Pokémon Japonaises | PokeJap',
    description: 'Achetez des singles Pokémon japonais et français. AR, SAR, ex, CHR, Full Art.',
    url: 'https://www.pokemon-cartes.fr/boutique',
  },
}

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
