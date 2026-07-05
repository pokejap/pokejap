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
              {[['/', 'Accueil'], ['/boutique', 'Boutique'], ['/scelles', 'Scellés'], ['/a-propos', 'À propos'], ['/panier', 'Mon Panier']].map(([href, label]) => (
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
            <ul className="space-y-2.5 text-sm text-gray-500">
              {['🇯🇵 Import direct du Japon', '✅ Authenticité garantie', '📦 Emballage sécurisé', '🔒 Paiement Stripe'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
