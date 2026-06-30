'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCartStore()
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared) {
      clearCart()
      setCleared(true)
    }
  }, [cleared, clearCart])

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 text-center">

      {/* Icône */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl scale-150" />
          <div className="relative w-28 h-28 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center">
            <CheckCircle size={56} className="text-green-400" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <p className="text-green-400 text-xs tracking-[0.3em] uppercase mb-3" translate="no">注文完了</p>
      <h1 className="text-4xl font-black text-white mb-4">
        Commande <span className="text-green-400">confirmée !</span>
      </h1>
      <p className="text-gray-400 text-base mb-10 leading-relaxed max-w-md mx-auto">
        Merci pour ta commande ! Tu vas recevoir un email de confirmation.
        Tes cartes seront expédiées sous 1–2 jours ouvrés.
      </p>

      {/* Infos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
        <div className="bg-pokemon-card rounded-xl p-5 border border-white/5 flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Mail size={18} className="text-blue-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-1">Email de confirmation</p>
            <p className="text-gray-500 text-xs leading-relaxed">Un récap a été envoyé par Stripe à ton adresse email.</p>
          </div>
        </div>
        <div className="bg-pokemon-card rounded-xl p-5 border border-white/5 flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <Package size={18} className="text-orange-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-1">Expédition rapide</p>
            <p className="text-gray-500 text-xs leading-relaxed">Cartes soigneusement emballées, expédiées sous 1–2 jours.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/boutique"
          className="inline-flex items-center justify-center gap-2 bg-pokemon-red hover:bg-red-600 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-[1.02]"
        >
          <ShoppingBag size={18} />
          Continuer mes achats
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all"
        >
          Retour à l'accueil
        </Link>
      </div>

      {sessionId && (
        <p className="text-gray-700 text-xs mt-8">Réf. : {sessionId.slice(-16)}</p>
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
