import { Metadata } from 'next'
import { getProductById } from '@/data/products'
import ProductDetailClient from './ProductDetailClient'

const BASE_URL = 'https://www.pokejap.fr'

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const product = getProductById(params.id)
  if (!product) return { title: 'Carte introuvable — PokeJap' }

  const title = `${product.name} ${product.rarity} — ${product.set} | PokeJap`
  const description = `Acheter ${product.name} (${product.rarity}) de l'extension ${product.set} — carte Pokémon japonaise authentique à ${product.price.toFixed(2)}€. Sleeve et top loader inclus. Livraison rapide.`

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.name} pokémon`,
      `${product.name} ${product.rarity}`,
      `${product.name} ${product.set}`,
      'carte pokémon japonaise',
      'acheter carte pokémon',
      product.set,
      product.rarity,
      'pokejap',
    ],
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/boutique/${product.id}`,
      images: [{ url: product.imageUrl, alt: product.name }],
      type: 'website',
    },
  }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: `${product.name} — ${product.rarity} — ${product.set} — ${product.condition}`,
    brand: { '@type': 'Brand', name: 'PokeJap' },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'EUR',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${BASE_URL}/boutique/${product.id}`,
      seller: { '@type': 'Organization', name: 'PokeJap' },
    },
  } : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient id={params.id} />
    </>
  )
}
