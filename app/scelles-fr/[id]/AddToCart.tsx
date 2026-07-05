'use client'
import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { Product } from '@/types'

export default function AddToCartFr({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore()
  const [added, setAdded] = useState(false)
  const [qty, setQty]     = useState(1)

  function handleAdd() {
    for (let i = 0; i < qty; i++) addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    openCart()
  }

  return (
    <div className="bg-white/3 border border-white/5 rounded-2xl p-6">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-gray-500 text-xs mb-1">Prix TTC</p>
          <p className="text-blue-400 font-black text-4xl">{product.price.toFixed(2)} €</p>
          <p className="text-gray-500 text-xs mt-1">Livraison 5,99 € · Mondial Relay</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs mb-1">Quantité</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors">−</button>
            <span className="text-white font-black text-lg w-6 text-center">{qty}</span>
            <button onClick={() => setQty(q => Math.min(10, q + 1))}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors">+</button>
          </div>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-base transition-all duration-200 active:scale-[0.98] ${
          added ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/40'
        }`}
      >
        {added
          ? <><Check size={18} /> Ajouté au panier !</>
          : <><ShoppingCart size={18} /> Ajouter au panier{qty > 1 ? ` (×${qty})` : ''}</>
        }
      </button>

      <p className="text-center text-[11px] text-gray-600 mt-3">
        Produit officiel français · Neuf et scellé · Expédié sous 48h
      </p>
    </div>
  )
}
