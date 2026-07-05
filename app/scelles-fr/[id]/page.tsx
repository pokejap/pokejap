import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Shield, Truck, Check } from 'lucide-react'
import { sealedFrProducts } from '@/data/sealed-fr'
import { Product } from '@/types'
import AddToCartFr from './AddToCart'

const TYPE_META: Record<string, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  display: { label: 'Display',  emoji: '📦', color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  border: 'border-yellow-400/30'  },
  etb:     { label: 'ETB',      emoji: '🎁', color: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400/30'  },
  coffret: { label: 'Coffret',  emoji: '🎀', color: 'text-green-400',   bg: 'bg-green-400/10',   border: 'border-green-400/30'   },
}

function RelatedCard({ product }: { product: Product }) {
  const t = TYPE_META[product.category ?? 'display']
  return (
    <Link href={`/scelles-fr/${product.id}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#0d0d14] hover:border-blue-500/40 transition-all duration-200">
      <div className="relative h-28 overflow-hidden">
        <img src={product.imageUrl} alt={product.name}
          className="w-full h-full object-cover object-center opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-300" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d14]" />
        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm ${t.bg} ${t.color} ${t.border}`}>
          {t.emoji} {t.label}
        </span>
      </div>
      <div className="p-3">
        <p className="text-white text-xs font-bold line-clamp-2 mb-2">{product.name}</p>
        <p className="text-blue-400 font-black text-base">{product.price.toFixed(2)} €</p>
      </div>
    </Link>
  )
}

export async function generateStaticParams() {
  return sealedFrProducts.map(p => ({ id: p.id }))
}

export default function SealedFrDetailPage({ params }: { params: { id: string } }) {
  const product = sealedFrProducts.find(p => p.id === params.id)
  if (!product) notFound()

  const t = TYPE_META[product.category ?? 'display']

  const related = sealedFrProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const specs = product.category === 'display'
    ? [
        { icon: '📦', label: 'Contenu', value: (product.contents ?? [])[0]?.match(/^(\d+)\s+boosters?/i)?.[0] ?? '36 boosters' },
        { icon: '🇫🇷', label: 'Langue', value: 'Français (FR)' },
        { icon: '✨', label: 'Par booster', value: '10 cartes' },
        { icon: '🔒', label: 'État', value: 'Scellé sous cellophane' },
      ]
    : product.category === 'etb'
    ? [
        { icon: '🎁', label: 'Contenu', value: '9 boosters + accessoires' },
        { icon: '🃏', label: 'Promo', value: '1 carte promo exclusive' },
        { icon: '🇫🇷', label: 'Langue', value: 'Français (FR)' },
        { icon: '🔒', label: 'État', value: 'Scellé officiel' },
      ]
    : [
        { icon: '🎀', label: 'Type', value: 'Coffret spécial' },
        { icon: '🇫🇷', label: 'Langue', value: 'Français (FR)' },
        { icon: '🌟', label: 'Édition', value: product.setCode || 'Écarlate & Violet' },
        { icon: '🔒', label: 'État', value: 'Scellé officiel' },
      ]

  return (
    <div className="min-h-screen bg-[#080810] pt-20">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/scelles-fr" className="hover:text-white transition-colors">Scellés FR</Link>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-square max-w-lg mx-auto lg:mx-0 border border-white/10 bg-[#0a0a12]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
            {/* Badge langue */}
            <div className="absolute top-4 left-4 bg-blue-900/80 backdrop-blur-sm text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-500/30">
              🇫🇷 Français officiel
            </div>
          </div>

          {/* Infos */}
          <div className="space-y-6">

            {/* Type + nom */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${t.bg} ${t.color} ${t.border}`}>
                  {t.emoji} {t.label}
                </span>
                <span className="text-xs text-gray-500 border border-white/10 px-3 py-1 rounded-full">
                  {product.setCode}
                </span>
              </div>
              <h1 className="text-3xl font-black text-white mb-2">{product.name}</h1>
              <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {specs.map(spec => (
                <div key={spec.label} className="bg-white/3 border border-white/5 rounded-xl p-3">
                  <p className="text-[11px] text-gray-500 mb-0.5">{spec.label}</p>
                  <p className="text-white font-bold text-sm">{spec.icon} {spec.value}</p>
                </div>
              ))}
            </div>

            {/* Contenu */}
            {product.contents && product.contents.length > 0 && (
              <div className="bg-white/3 border border-white/5 rounded-xl p-4">
                <p className="text-white font-bold text-sm mb-3">📋 Contenu du produit</p>
                <ul className="space-y-2">
                  {product.contents.map((c, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                      <Check size={14} className="text-blue-400 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bouton ajout panier */}
            <AddToCartFr product={product} />

            {/* Garanties */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Shield size={16} />, text: 'Produit officiel Pokémon' },
                { icon: <Truck size={16} />, text: 'Expédition sous 48h' },
                { icon: <span className="text-base">🇫🇷</span>, text: 'Expédié depuis la France' },
                { icon: <Check size={16} />, text: 'Aucun frais de douane' },
              ].map((g, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-400 text-xs">
                  <span className="text-blue-400">{g.icon}</span>
                  {g.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-white font-black text-xl mb-6">
              Autres <span className="text-blue-400">{t.label}s</span> français
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
