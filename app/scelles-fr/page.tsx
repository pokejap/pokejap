'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { sealedFrProducts } from '@/data/sealed-fr'
import { useCartStore } from '@/lib/cart-store'
import { Product, ProductCategory } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  display: { label: 'Display',  emoji: '📦', color: 'text-yellow-400',  bg: 'bg-yellow-400/10 border-yellow-400/30' },
  etb:     { label: 'ETB',      emoji: '🎁', color: 'text-purple-400',  bg: 'bg-purple-400/10 border-purple-400/30' },
  coffret: { label: 'Coffret',  emoji: '🎀', color: 'text-green-400',  bg: 'bg-green-400/10  border-green-400/30'  },
}

// ── Card produit scellé FR ────────────────────────────────────────────────────
function SealedFrCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  const t = TYPE_LABELS[product.category ?? 'display']
  const inStock = product.stock > 0

  return (
    <Link
      href={`/scelles-fr/${product.id}`}
      className={`group rounded-2xl overflow-hidden border bg-[#0d0d14] transition-all duration-300 flex flex-col ${inStock ? 'border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/30' : 'border-white/5 opacity-60'}`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={product.imageUrl}
          alt=""
          aria-hidden
          className={`absolute inset-0 w-full h-full object-cover object-top scale-110 transition-all duration-500 ${inStock ? 'opacity-40 group-hover:opacity-55 group-hover:scale-115' : 'opacity-20'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0d0d14]" />

        {/* Overlay sold out */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <span className="bg-black/80 text-gray-400 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 tracking-widest uppercase">
              Rupture de stock
            </span>
          </div>
        )}

        {/* Badge type */}
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm z-10 ${t.bg} ${t.color}`}>
          {t.emoji} {t.label}
        </span>

        {/* Badge langue */}
        <span className="absolute top-3 right-3 bg-blue-900/70 backdrop-blur-sm text-[10px] text-blue-300 font-bold px-2 py-1 rounded-full border border-blue-500/30 z-10">
          🇫🇷 FR
        </span>

        {/* Nom de l'édition */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-3 text-center pointer-events-none">
          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">
            {product.setCode}
          </span>
          <span className="text-white font-black text-sm leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform duration-300 line-clamp-2">
            {product.set}
          </span>
        </div>
      </div>

      {/* Infos produit */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="text-white font-black text-sm leading-tight mb-1">{product.name}</h3>
          <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2">{product.description}</p>
        </div>

        {product.contents && product.contents.length > 0 && (
          <ul className="space-y-0.5">
            {product.contents.slice(0, 3).map((c, i) => (
              <li key={i} className="text-[10px] text-gray-500 flex items-center gap-1">
                <span className="text-blue-400">·</span> {c}
              </li>
            ))}
          </ul>
        )}

        {/* Prix + bouton */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <span className={`font-black text-xl ${inStock ? 'text-blue-400' : 'text-gray-500'}`}>{product.price.toFixed(2)} €</span>
          {inStock ? (
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); onAdd() }}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors duration-200 active:scale-95"
            >
              <ShoppingCart size={14} /> Ajouter
            </button>
          ) : (
            <span className="text-[10px] text-gray-600 font-semibold px-3 py-2 rounded-xl border border-white/5">
              Indisponible
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function ScellesFrPage() {
  const [activeType, setActiveType] = useState<ProductCategory | 'tous'>('tous')
  const [activeSet, setActiveSet]   = useState<string>('tous')
  const [showAllSets, setShowAllSets] = useState(false)
  const { addItem, openCart }       = useCartStore()

  const allSets = useMemo(() =>
    Array.from(new Set(sealedFrProducts.map(p => p.set))),
    []
  )

  const visibleSets = showAllSets ? allSets : allSets.slice(0, 3)

  const filtered = useMemo(() => {
    let result = [...sealedFrProducts]
    if (activeType !== 'tous') result = result.filter(p => p.category === activeType)
    if (activeSet  !== 'tous') result = result.filter(p => p.set      === activeSet)
    return result
  }, [activeType, activeSet])

  function handleAdd(product: Product) {
    addItem(product)
    openCart()
  }

  const counts = {
    tous:    sealedFrProducts.length,
    display: sealedFrProducts.filter(p => p.category === 'display').length,
    etb:     sealedFrProducts.filter(p => p.category === 'etb').length,
    coffret: sealedFrProducts.filter(p => p.category === 'coffret').length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">

      {/* Header */}
      <div className="mb-10">
        <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-1">🇫🇷 VERSION FRANÇAISE</p>
        <h1 className="text-4xl font-black text-white mb-1">
          Scellés <span className="text-blue-400">Français</span>
        </h1>
        <p className="text-gray-400 text-sm">
          {sealedFrProducts.length} produits · Displays, ETB &amp; Coffrets FR · Expédié sous 48h
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Stock permanent — expédié directement depuis la France
        </div>
      </div>

      {/* Filtres type */}
      <div className="flex flex-wrap gap-2 mb-6">
        {([
          { key: 'tous',    label: 'Tous',     emoji: '🎯', count: counts.tous    },
          { key: 'display', label: 'Displays', emoji: '📦', count: counts.display },
          { key: 'etb',     label: 'ETB',      emoji: '🎁', count: counts.etb     },
          { key: 'coffret', label: 'Coffrets', emoji: '🎀', count: counts.coffret },
        ] as const).map(({ key, label, emoji, count }) => (
          <button
            key={key}
            onClick={() => setActiveType(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              activeType === key
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40'
                : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
            }`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
            <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${activeType === key ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Filtre par édition */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveSet('tous')}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${activeSet === 'tous' ? 'bg-white/10 border-white/30 text-white' : 'border-white/5 text-gray-500 hover:text-gray-300'}`}
        >
          Toutes les éditions
        </button>
        {visibleSets.map(set => (
          <button
            key={set}
            onClick={() => setActiveSet(set)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${activeSet === set ? 'bg-white/10 border-white/30 text-white' : 'border-white/5 text-gray-500 hover:text-gray-300'}`}
          >
            {set}
          </button>
        ))}
        {allSets.length > 3 && (
          <button
            onClick={() => setShowAllSets(v => !v)}
            className="px-3 py-1.5 rounded-lg border border-white/5 text-xs font-medium text-gray-500 hover:text-gray-300 transition-all"
          >
            {showAllSets ? 'Voir moins ↑' : `Voir plus (${allSets.length - 3}) ↓`}
          </button>
        )}
      </div>

      {/* Grille produits */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg font-medium">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <SealedFrCard
              key={product.id}
              product={product}
              onAdd={() => handleAdd(product)}
            />
          ))}
        </div>
      )}

      {/* Garanties livraison */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { emoji: '🇫🇷', title: 'Produits officiels FR', desc: 'Toutes nos éditions françaises sont authentiques, 100% neuves et scellées sous cellophane d\'origine.' },
          { emoji: '📦', title: 'Emballage soigné', desc: 'Chaque commande est emballée avec soin pour garantir l\'arrivée en parfait état.' },
          { emoji: '🚀', title: 'Expédition sous 48h', desc: 'Commande passée avant midi ? Expédiée le jour même ou le lendemain. Aucun frais de douane.' },
        ].map(({ emoji, title, desc }) => (
          <div key={title} className="bg-white/3 border border-white/5 rounded-2xl p-5 flex gap-4">
            <span className="text-3xl">{emoji}</span>
            <div>
              <p className="text-white font-bold text-sm mb-1">{title}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
