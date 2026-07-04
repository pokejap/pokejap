'use client'
import { useState, useMemo } from 'react'
import { ShoppingCart, Package, Box, Layers, Filter } from 'lucide-react'
import { sealedProducts } from '@/data/sealed'
import { useCartStore } from '@/lib/cart-store'
import { Product, ProductCategory } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  display: { label: 'Display',  emoji: '📦', color: 'text-yellow-400',  bg: 'bg-yellow-400/10 border-yellow-400/30' },
  etb:     { label: 'ETB',      emoji: '🎁', color: 'text-purple-400',  bg: 'bg-purple-400/10 border-purple-400/30' },
  booster: { label: 'Booster',  emoji: '🎴', color: 'text-blue-400',    bg: 'bg-blue-400/10   border-blue-400/30'   },
  coffret: { label: 'Coffret',  emoji: '🏷️', color: 'text-green-400',  bg: 'bg-green-400/10  border-green-400/30'  },
}

// ── Sealed Product Card ───────────────────────────────────────────────────────
function SealedCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  const t = TYPE_LABELS[product.category ?? 'display']

  return (
    <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d14] hover:border-pokemon-red/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/30 flex flex-col">

      {/* Image de fond */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={product.imageUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-top scale-110 opacity-40 group-hover:opacity-55 group-hover:scale-115 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0d0d14]" />

        {/* Badge type */}
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm z-10 ${t.bg} ${t.color}`}>
          {t.emoji} {t.label}
        </span>

        {/* Badge dropship */}
        <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-[10px] text-green-400 font-bold px-2 py-1 rounded-full border border-green-400/30 z-10">
          ✓ En stock
        </span>

        {/* Nom de l'édition au centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-3 text-center pointer-events-none">
          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1" translate="no">
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

        {/* Contenu */}
        {product.contents && product.contents.length > 0 && (
          <ul className="space-y-0.5">
            {product.contents.slice(0, 3).map((c, i) => (
              <li key={i} className="text-[10px] text-gray-500 flex items-center gap-1">
                <span className="text-pokemon-red">·</span> {c}
              </li>
            ))}
          </ul>
        )}

        {/* Prix + bouton */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <span className="text-pokemon-red font-black text-xl">{product.price.toFixed(2)} €</span>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 bg-pokemon-red hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors duration-200 active:scale-95"
          >
            <ShoppingCart size={14} /> Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function ScellesPage() {
  const [activeType, setActiveType] = useState<ProductCategory | 'tous'>('tous')
  const [activeSet, setActiveSet]   = useState<string>('tous')
  const { addItem, openCart }       = useCartStore()

  // Construire la liste des sets uniques
  const allSets = useMemo(() =>
    Array.from(new Set(sealedProducts.map(p => p.set))),
    []
  )

  const filtered = useMemo(() => {
    let result = [...sealedProducts]
    if (activeType !== 'tous') result = result.filter(p => p.category === activeType)
    if (activeSet  !== 'tous') result = result.filter(p => p.set      === activeSet)
    return result
  }, [activeType, activeSet])

  function handleAdd(product: Product) {
    addItem(product)
    openCart()
  }

  const counts = {
    tous:    sealedProducts.length,
    display: sealedProducts.filter(p => p.category === 'display').length,
    etb:     sealedProducts.filter(p => p.category === 'etb').length,
    booster: sealedProducts.filter(p => p.category === 'booster').length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">

      {/* Header */}
      <div className="mb-10">
        <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-1" translate="no">シールド</p>
        <h1 className="text-4xl font-black text-white mb-1">
          Produits <span className="text-pokemon-red">Scellés</span>
        </h1>
        <p className="text-gray-400 text-sm">
          {sealedProducts.length} produits · Displays, ETB &amp; Boosters japonais · Expédié sous 48h
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Dropshipping — stock permanent via Hikaru Distribution
        </div>
      </div>

      {/* Filtres type */}
      <div className="flex flex-wrap gap-2 mb-6">
        {([
          { key: 'tous',    label: 'Tous',     emoji: '🎯', count: counts.tous    },
          { key: 'display', label: 'Displays', emoji: '📦', count: counts.display },
          { key: 'etb',     label: 'ETB',      emoji: '🎁', count: counts.etb     },
          { key: 'booster', label: 'Boosters', emoji: '🎴', count: counts.booster },
        ] as const).map(({ key, label, emoji, count }) => (
          <button
            key={key}
            onClick={() => setActiveType(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              activeType === key
                ? 'bg-pokemon-red border-pokemon-red text-white shadow-lg shadow-red-900/40'
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
        {allSets.map(set => (
          <button
            key={set}
            onClick={() => setActiveSet(set)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${activeSet === set ? 'bg-white/10 border-white/30 text-white' : 'border-white/5 text-gray-500 hover:text-gray-300'}`}
          >
            {set}
          </button>
        ))}
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
            <SealedCard
              key={product.id}
              product={product}
              onAdd={() => handleAdd(product)}
            />
          ))}
        </div>
      )}

      {/* Info dropshipping */}
      <div className="mt-12 bg-white/3 border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-black mb-3 flex items-center gap-2">
          <Package size={18} className="text-pokemon-red" />
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-400">
          <div className="flex gap-3">
            <span className="text-2xl">🛒</span>
            <div>
              <p className="text-white font-semibold mb-1">Tu commandes</p>
              <p>Tu passes ta commande sur pokejap.fr comme pour n'importe quel produit.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">🏭</span>
            <div>
              <p className="text-white font-semibold mb-1">On expédie pour toi</p>
              <p>On transmet ta commande à Hikaru Distribution, le n°1 importateur japonais en France.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">📬</span>
            <div>
              <p className="text-white font-semibold mb-1">Tu reçois sous 48h</p>
              <p>Le produit est expédié directement depuis le stock Hikaru en France.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
