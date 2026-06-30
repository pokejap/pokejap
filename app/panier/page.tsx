'use client'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'

export default function PanierPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-600 mb-6" />
        <h1 className="text-3xl font-black text-white mb-4">Votre panier est vide</h1>
        <Link href="/boutique" className="inline-flex items-center gap-2 bg-pokemon-red hover:bg-pokemon-darkred text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
          Aller a la boutique <ArrowRight size={20} />
        </Link>
      </div>
    )
  }
  const subtotal = getTotalPrice()
  const shipping = subtotal >= 30 ? 0 : 5.99
  const total = subtotal + shipping
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black text-white">Mon <span className="text-pokemon-red">Panier</span></h1>
        <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-400 flex items-center gap-1"><Trash2 size={14} /> Vider</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="bg-pokemon-card rounded-xl p-4 flex gap-4 border border-white/5">
              <Link href={`/boutique/${item.product.id}`} className="relative w-20 h-28 flex-shrink-0 bg-black/20 rounded-lg overflow-hidden">
                <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain" />
              </Link>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold">{item.product.name}</h3>
                <p className="text-gray-400 text-sm">{item.product.set} — {item.product.number}</p>
                <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"><Minus size={14} /></button>
                    <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30"><Plus size={14} /></button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-pokemon-yellow font-bold text-lg">{(item.product.price * item.quantity).toFixed(2)} €</span>
                    <button onClick={() => removeItem(item.product.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Link href="/boutique" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mt-2"><ArrowLeft size={16} /> Continuer mes achats</Link>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-pokemon-card rounded-xl p-6 border border-white/5 sticky top-20">
            <h2 className="text-white font-bold text-xl mb-6">Recapitulatif</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Sous-total</span>
                <span className="text-white">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Livraison</span>
                <span className={shipping === 0 ? "text-green-400 font-medium" : "text-white"}>{shipping === 0 ? "Gratuite !" : `${shipping.toFixed(2)} €`}</span>
              </div>
              {shipping > 0 && <p className="text-gray-500 text-xs">Gratuite dès 30 € d'achat</p>}
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-pokemon-yellow font-black text-xl">{total.toFixed(2)} €</span>
              </div>
            </div>
            <Link href="/checkout" className="block w-full bg-pokemon-yellow hover:bg-yellow-400 text-pokemon-darker text-center py-4 rounded-xl font-black text-lg transition-all hover:scale-[1.02]">Commander</Link>
            <p className="text-gray-500 text-xs text-center mt-4">Paiement securise par Stripe</p>
          </div>
        </div>
      </div>
    </div>
  )
}
