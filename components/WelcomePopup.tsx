'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'

const STORAGE_KEY = 'pokejap_popup_seen'

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false)
  const user = useAuthStore(s => s.user)

  useEffect(() => {
    if (user) return // déjà connecté → pas de popup
    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(t)
    }
  }, [user])

  function close() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d14] shadow-2xl shadow-black/80 animate-fade-in-up">

        {/* Fond décoratif */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-transparent to-yellow-950/10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-900/20 blur-[60px] pointer-events-none" />

        {/* Bouton fermer */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X size={14} className="text-white/60" />
        </button>

        {/* Contenu */}
        <div className="relative p-8 text-center">
          <div className="text-5xl mb-4 inline-block">🎁</div>

          <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-2" translate="no">
            Offre de bienvenue
          </p>

          <h2 className="text-white font-black text-2xl leading-tight mb-3">
            −10% sur votre<br />
            <span className="shimmer-text">première commande</span>
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Créez votre compte gratuitement et recevez immédiatement un code de réduction de <strong className="text-white">10%</strong> sur l'ensemble de la boutique.
          </p>

          <Link
            href="/compte?tab=register"
            onClick={close}
            className="block w-full py-4 bg-pokemon-red hover:bg-red-700 text-white font-black text-base rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-red-950/50 mb-3"
          >
            Créer mon compte →
          </Link>

          <button
            onClick={close}
            className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
          >
            Non merci, continuer sans réduction
          </button>
        </div>

        {/* Bande basse */}
        <div className="border-t border-white/5 px-8 py-3 flex items-center justify-center gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
          <span>🇯🇵 Import direct Japon</span>
          <span>·</span>
          <span>🔒 Paiement sécurisé</span>
          <span>·</span>
          <span>🚀 Expédié 48h</span>
        </div>
      </div>
    </div>
  )
}
