'use client'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={closeCart} />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-pokemon-dark z-50 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <ShoppingBag size={20} className="text-pokemon-red" /> Mon Panier
          </h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-white p-1"><X size={22} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-4">
              <ShoppingBag size={48} className="opacity-30" />
              <p className="text-sm">Votre panier est vide</p>
              <button onClick={closeCart} className="text-pokemon-yellow text-sm hover:underline">Continuer mes achats</button>
            </div>
          ) : items.map((item) => (
            <div key={item.product.id} className="flex gap-3 bg-pokemon-card rounded-lg p-3">
              <div className="relative w-16 h-20 flex-shrink-0 bg-black/20 rounded overflow-hidden">
                <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{item.product.name}</p>
                <p className="text-gray-400 text-xs">{item.product.set}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"><Minus size={12} /></button>
                    <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30"><Plus size={12} /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-pokemon-yellow font-bold text-sm">{(item.product.price * item.quantity).toFixed(2)} €</span>
                    <button onClick={() => removeItem(item.product.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 space-y-3">
            <div className="flex justify-between text-white">
              <span className="text-gray-400">Total</span>
              <span className="font-bold text-lg">{getTotalPrice().toFixed(2)} €</span>
            </div>
            <Link href="/panier" onClick={closeCart} className="block w-full bg-pokemon-red hover:bg-pokemon-darkred text-white text-center py-3 rounded-lg font-semibold transition-colors">Voir le panier</Link>
            <Link href="/checkout" onClick={closeCart} className="block w-full bg-pokemon-yellow hover:bg-yellow-400 text-pokemon-darker text-center py-3 rounded-lg font-bold transition-colors">Commander</Link>
          </div>
        )}
      </div>
    </>
  )
}
