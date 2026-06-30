import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Pokeball cassée */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-pokemon-red/10 blur-3xl scale-150" />
            <svg viewBox="0 0 120 120" className="relative w-32 h-32 opacity-60" fill="none">
              <circle cx="60" cy="60" r="56" stroke="rgb(220,38,38)" strokeWidth="3"/>
              <rect x="4" y="57" width="112" height="6" fill="rgb(220,38,38)"/>
              <circle cx="60" cy="60" r="14" fill="rgb(15,15,25)" stroke="rgb(220,38,38)" strokeWidth="3"/>
              <circle cx="60" cy="60" r="7" fill="rgb(220,38,38)" opacity="0.4"/>
              <path d="M50 25 L55 40 L48 45 L58 62" stroke="rgb(220,38,38)" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
            </svg>
          </div>
        </div>

        <p className="text-pokemon-red text-xs tracking-[0.3em] uppercase mb-3" translate="no">エラー 404</p>
        <h1 className="text-7xl font-black text-white mb-2">404</h1>
        <h2 className="text-2xl font-black text-white mb-4">Page introuvable</h2>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Oops, cette page s'est échappée comme un Pokémon sauvage.
          Elle n'existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/boutique"
            className="inline-flex items-center justify-center gap-2 bg-pokemon-red hover:bg-red-600 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-[1.02]"
          >
            <ShoppingBag size={18} />
            Voir la boutique
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-6 py-4 rounded-xl transition-all"
          >
            <ArrowLeft size={16} />
            Accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
