import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos — PokeJap',
  description: 'Découvrez PokeJap, votre boutique spécialisée en cartes Pokémon japonaises authentiques. Importées directement du Japon, livrées en France.',
  openGraph: {
    title: 'À propos — PokeJap',
    description: 'Découvrez PokeJap, boutique spécialisée en cartes Pokémon japonaises authentiques.',
    url: 'https://www.pokemon-cartes.fr/a-propos',
  },
}

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
