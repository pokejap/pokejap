'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'

const COOKIE_KEY = 'pokejap-cookies-accepted'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Afficher seulement si pas encore répondu
    if (!localStorage.getItem(COOKIE_KEY)) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem(COOKIE_KEY, 'true')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, 'false')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] flex justify-center pointer-events-none">
      <div className="bg-[#111120] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-2xl w-full pointer-events-auto">
        <Cookie size={22} className="text-pokemon-yellow shrink-0 mt-0.5 sm:mt-0" />

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm mb-1">Ce site utilise des cookies</p>
          <p className="text-gray-500 text-xs leading-relaxed">
            Uniquement des cookies essentiels (panier, session). Aucun cookie publicitaire.{' '}
            <Link href="/confidentialite" className="text-pokemon-red hover:underline">
              En savoir plus
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="text-gray-500 hover:text-white text-xs px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="bg-pokemon-red hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all hover:scale-[1.02]"
          >
            Accepter
          </button>
          <button onClick={decline} className="text-gray-600 hover:text-gray-400 p-1 transition-colors" aria-label="Fermer">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
