'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { Product } from '@/types'
import { useState } from 'react'

const RARITY_COLORS: Record<string, string> = {
  "Commune":     "bg-gray-700 text-gray-200",
  "Peu Commune": "bg-green-900 text-green-200",
  "Rare":        "bg-blue-900 text-blue-200",
  "Rare Holo":   "bg-purple-900 text-purple-200",
  "Ultra Rare":  "bg-yellow-900 text-yellow-200",
  "Secret Rare": "bg-pink-900 text-pink-200",
  "V":           "bg-blue-800 text-blue-100",
  "VMAX":        "bg-red-900 text-red-100",
  "ex":          "bg-orange-900 text-orange-100",
  "GX":          "bg-teal-900 text-teal-100",
  "AR":          "bg-violet-900 text-violet-200",
  "CHR":         "bg-fuchsia-900 text-fuchsia-200",
  "SAR":         "bg-rose-900 text-rose-200",
  "UR":          "bg-amber-900 text-amber-200",
}

const LANG_BADGE: Record<string, { flag: string; color: string }> = {
  JAP: { flag: '🇯🇵', color: 'bg-red-950 border border-red-800/40 text-red-300' },
  EN:  { flag: '🇺🇸', color: 'bg-blue-950 border border-blue-800/40 text-blue-300' },
  FR:  { flag: '🇫🇷', color: 'bg-indigo-950 border border-indigo-700/40 text-indigo-300' },
}

export default function ProductCard({ product, href }: { product: Product; href?: string }) {
  const { addItem, openCart } = useCartStore()
  const [added, setAdded] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const rarityClass = RARITY_COLORS[product.rarity] || "bg-gray-700 text-gray-200"
  const langBadge = LANG_BADGE[product.language] ?? LANG_BADGE.JAP

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 20
    setTilt({ x, y })
  }
  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => { setAdded(false); openCart() }, 600)
  }

  return (
    <div
      className="group relative"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Halo glow derriere la carte */}
      <div
        className="absolute inset-0 rounded-2xl blur-xl transition-all duration-500 pointer-events-none"
        style={{
          background: hovered ? 'radial-gradient(ellipse, rgba(220,38,38,0.25) 0%, transparent 70%)' : 'transparent',
          transform: 'scale(1.1)',
        }}
      />

      <Link href={href ?? `/boutique/${product.id}`} onClick={() => { if (!href) sessionStorage.setItem('boutique-scroll', String(window.scrollY)) }}>
        <div
          className="relative bg-[#111120] border border-white/[0.06] rounded-2xl overflow-hidden card-shine transition-all duration-300"
          style={{
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) ${hovered ? 'scale(1.04)' : 'scale(1)'}`,
            boxShadow: hovered
              ? '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(220,38,38,0.2)'
              : '0 4px 20px rgba(0,0,0,0.4)',
            transition: 'transform 0.15s ease, box-shadow 0.3s ease',
          }}
        >
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-[#0D0D1A]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />

            {/* Badge stock */}
            {product.stock === 1 && (
              <div className="absolute top-2 left-2 bg-orange-600/90 text-white text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                Dernier !
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <div className="absolute top-0 left-0 w-full overflow-hidden" style={{ height: '100%', pointerEvents: 'none' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '28%',
                      left: '-30%',
                      width: '160%',
                      textAlign: 'center',
                      transform: 'rotate(-35deg)',
                      backgroundColor: '#b91c1c',
                      color: 'white',
                      fontWeight: '900',
                      fontSize: '1rem',
                      letterSpacing: '0.15em',
                      padding: '6px 0',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Sold Out
                  </div>
                </div>
              </div>
            )}

            {/* Reflet holographique au hover */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: hovered ? 0.15 : 0,
                background: `radial-gradient(circle at ${50 + tilt.x * 2}% ${50 - tilt.y * 2}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
              }}
            />
          </div>

          {/* Infos */}
          <div className="p-3">
            <div className="flex items-start justify-between gap-1 mb-2">
              <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 flex-1">
                {product.name}
              </h3>
              <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${langBadge.color}`}>
                {langBadge.flag} {product.language}
              </span>
            </div>

            <div className="flex items-center gap-1 mb-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${rarityClass}`}>
                {product.rarity}
              </span>
            </div>

            <p className="text-gray-500 text-xs mb-3 truncate">{product.set}</p>

            <div className="flex items-center justify-between">
              <span className="text-pokemon-yellow font-black text-lg">
                {product.price.toFixed(2)}€
              </span>
              {product.stock > 0 && (
                <button
                  onClick={handleAdd}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    added
                      ? 'bg-green-600 text-white scale-95'
                      : 'bg-pokemon-red hover:bg-red-600 text-white hover:scale-105'
                  }`}
                >
                  <ShoppingCart size={12} />
                  {added ? 'Ajoute !' : 'Ajouter'}
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
