import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Package, Zap, Shield, Truck, Star, Check, ChevronLeft } from 'lucide-react'
import { sealedProducts } from '@/data/sealed'
import { Product } from '@/types'
import AddToCart from './AddToCart'

const TYPE_META: Record<string, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  display: { label: 'Display',  emoji: '📦', color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  border: 'border-yellow-400/30'  },
  etb:     { label: 'ETB',      emoji: '🎁', color: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400/30'  },
  booster: { label: 'Booster',  emoji: '🎴', color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/30'    },
  coffret: { label: 'Coffret',  emoji: '🎀', color: 'text-green-400',   bg: 'bg-green-400/10',   border: 'border-green-400/30'   },
}

function RelatedCard({ product }: { product: Product }) {
  const t = TYPE_META[product.category ?? 'display']
  return (
    <Link href={`/scelles/${product.id}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#0d0d14] hover:border-pokemon-red/40 transition-all duration-200">
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
        <p className="text-pokemon-red font-black text-base">{product.price.toFixed(2)} €</p>
      </div>
    </Link>
  )
}

export async function generateStaticParams() {
  return sealedProducts.map(p => ({ id: p.id }))
}

export default function SealedDetailPage({ params }: { params: { id: string } }) {
  const product = sealedProducts.find(p => p.id === params.id)
  if (!product) notFound()

  const t = TYPE_META[product.category ?? 'display']

  const related = sealedProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const specs = product.category === 'display'
    ? [
        { icon: '📦', label: 'Contenu', value: (product.contents ?? [])[0]?.match(/^(\d+)\s+boosters?/i)?.[0] ?? '30 boosters' },
        { icon: '🇯🇵', label: 'Langue', value: 'Japonais (JAP)' },
        { icon: '✨', label: 'Taux SAR', value: '~1 pour 3 boosters' },
        { icon: '🔒', label: 'État', value: 'Scellé sous cellophane' },
      ]
    : product.category === 'etb'
    ? [
        { icon: '🎁', label: 'Contenu', value: '10 boosters + accessoires' },
        { icon: '🃏', label: 'Sleeves', value: '65 sleeves officielles' },
        { icon: '🇯🇵', label: 'Langue', value: 'Japonais (JAP)' },
        { icon: '🔒', label: 'État', value: 'Scellé officiel' },
      ]
    : [
        { icon: '🎀', label: 'Type', value: 'Coffret spécial' },
        { icon: '🇯🇵', label: 'Langue', value: 'Japonais (JAP)' },
        { icon: '🌸', label: 'Origine', value: 'Pokémon Center Japon' },
        { icon: '🔒', label: 'État', value: 'Scellé officiel' },
      ]

  return (
    <div className="min-h-screen bg-[#080810] pt-20">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/scelles" className="hover:text-white transition-colors">Scellés</Link>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Produit principal */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Colonne gauche : Image ─────────────────────────── */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d14] shadow-2xl shadow-black/60 aspect-[4/3]">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain p-6"
                />
                <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-sm ${t.bg} ${t.color} ${t.border}`}>
                  {t.emoji} {t.label}
                </span>
                <span className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  En stock
                </span>
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white/40 text-[10px] font-mono font-bold px-2 py-1 rounded-lg border border-white/10">
                  {product.setCode}
                </div>
              </div>

              {/* Garanties sous l'image */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: Shield, label: '100% Authentique' },
                  { icon: Truck,  label: 'Expédié 48h' },
                  { icon: Zap,    label: 'Stock permanent' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 bg-white/3 border border-white/5 rounded-xl p-3 text-center">
                    <Icon size={16} className="text-pokemon-red" />
                    <span className="text-[10px] text-gray-400 leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Colonne droite : Infos produit ─────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Titre */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-widest text-pokemon-red uppercase">{product.setCode}</span>
                <span className="text-white/20">·</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">JAP</span>
              </div>
              <h1 className="text-3xl font-black text-white leading-tight mb-2">{product.name}</h1>
              <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {specs.map(s => (
                <div key={s.label} className="bg-white/3 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-xl">{s.icon}</span>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{s.label}</p>
                    <p className="text-white text-xs font-semibold">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contenu */}
            {product.contents && product.contents.length > 0 && (
              <div className="bg-white/3 border border-white/5 rounded-xl p-5">
                <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
                  <Package size={15} className="text-pokemon-red" />
                  Contenu du produit
                </h3>
                <ul className="space-y-2">
                  {product.contents.map((c, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <Check size={14} className="text-green-400 mt-0.5 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bouton panier — client component */}
            <AddToCart product={product} />

            {/* Note collector */}
            <div className="border border-yellow-400/20 bg-yellow-400/5 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Star size={16} className="text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-yellow-400 text-xs font-bold mb-1">Note collector</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Tous nos produits scellés sont importés directement depuis le Japon via nos distributeurs Pro agréés.
                    Authenticité 100% garantie — chaque produit est livré dans son emballage officiel d'origine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-xl">
                Autres <span className="text-pokemon-red">{t.label}s</span>
              </h2>
              <Link href="/scelles" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                Voir tout <ChevronLeft size={12} className="rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
