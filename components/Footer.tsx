import Link from 'next/link'
import PokejapLogo from './PokejapLogo'

export default function Footer() {
  return (
    <footer className="bg-[#070710] border-t border-white/[0.04] mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <PokejapLogo size={38} />
              <div>
                <div className="text-white font-black text-base">Poke<span className="shimmer-text">Jap</span></div>
                <div className="text-[9px] text-white/25 tracking-widest" translate="no">ポケモンカード専門店</div>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Boutique spécialisée en displays, coffrets scellés et singles Pokémon japonais. Authenticité garantie.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">Navigation</h3>
            <ul className="space-y-2.5">
              {[['/', 'Accueil'], ['/boutique', 'Boutique'], ['/scelles', 'Scellés JAP'], ['/scelles-fr', 'Scellés FR'], ['/a-propos', 'À propos'], ['/panier', 'Mon Panier']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-500 text-sm hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-3 h-px bg-red-800/40 group-hover:bg-pokemon-red group-hover:w-5 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">Nos engagements</h3>
            <ul className="space-y-2.5 text-sm text-gray-500 mb-6">
              {['🇯🇵 Import direct du Japon', '✅ Authenticité garantie', '📦 Emballage sécurisé', '🔒 Paiement Stripe'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="text-white font-semibold mb-3 text-sm tracking-wide">Suivez-nous</h3>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/pokejap.fr" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/5 hover:bg-pink-500/15 border border-white/10 hover:border-pink-500/30 text-gray-400 hover:text-pink-400 text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram
              </a>
              <a href="https://www.tiktok.com/@pokejap.fr" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Liens légaux */}
        <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© 2025 PokeJap · Pokémon est une marque déposée de Nintendo / Game Freak</span>
          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="hover:text-gray-400 transition-colors">Mentions légales</Link>
            <Link href="/cgv" className="hover:text-gray-400 transition-colors">CGV</Link>
            <Link href="/confidentialite" className="hover:text-gray-400 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
