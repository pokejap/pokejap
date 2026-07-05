import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'
import { sealedProducts } from '@/data/sealed'

export const metadata: Metadata = {
  title: 'PokeJap — Cartes & Scellés Pokémon Japonais',
  description: 'Boutique spécialisée en Pokémon japonais — displays, coffrets scellés et cartes singles authentiques importés directement du Japon.',
}

const SAKURA_PETALS = [
  { left: '5%',  delay: '0s',    duration: '7s',  size: 10, opacity: 0.7 },
  { left: '15%', delay: '1.2s',  duration: '9s',  size: 14, opacity: 0.5 },
  { left: '25%', delay: '2.5s',  duration: '6.5s',size: 8,  opacity: 0.8 },
  { left: '35%', delay: '0.8s',  duration: '8s',  size: 12, opacity: 0.6 },
  { left: '48%', delay: '3.1s',  duration: '10s', size: 10, opacity: 0.5 },
  { left: '58%', delay: '1.8s',  duration: '7.5s',size: 16, opacity: 0.4 },
  { left: '68%', delay: '0.4s',  duration: '8.5s',size: 9,  opacity: 0.7 },
  { left: '78%', delay: '2.2s',  duration: '6s',  size: 13, opacity: 0.6 },
  { left: '88%', delay: '4.0s',  duration: '9.5s',size: 11, opacity: 0.5 },
  { left: '94%', delay: '1.5s',  duration: '7s',  size: 8,  opacity: 0.8 },
]

function SakuraPetal({ left, delay, duration, size, opacity }: typeof SAKURA_PETALS[0]) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left, top: '-60px', animation: `sakura-fall ${duration} ${delay} linear infinite`, opacity, zIndex: 1 }}
    >
      <svg width={size} height={size * 1.1} viewBox="0 0 20 22" fill="none">
        <path d="M10 0C10 0 3 6 3 12C3 16.4 6.1 20 10 22C13.9 20 17 16.4 17 12C17 6 10 0 10 0Z" fill="#FFB7C5"/>
        <path d="M10 0C10 0 3 6 3 12C3 16.4 6.1 20 10 22" stroke="#FF8FAB" strokeWidth="0.5" fill="none"/>
      </svg>
    </div>
  )
}

const FEATURED_SEALED_IDS = ['display-sv10', 'display-sv9a', 'display-sv11w', 'display-sv8a']

export default function HomePage() {
  // Les 4 SAR les plus visuellement impressionnantes du catalogue
  const FEATURED_SINGLES_IDS = ['blk-173', 'sv11w-171', 'sv5m-093', 'sv4k-093']
  const featuredSingles = FEATURED_SINGLES_IDS
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as typeof products
  const featuredSealed  = FEATURED_SEALED_IDS
    .map(id => sealedProducts.find(p => p.id === id))
    .filter(Boolean) as typeof sealedProducts

  const displayCount = sealedProducts.filter(p => p.category === 'display').length
  const coffretCount = sealedProducts.filter(p => p.category === 'coffret').length
  const cartesCount  = products.length

  return (
    <div className="overflow-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A14] via-[#120818] to-[#0A0A14]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-900/10 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-yellow-800/8 blur-[80px] animate-pulse" style={{animationDelay:'1.5s'}} />
        {SAKURA_PETALS.map((p, i) => <SakuraPetal key={i} {...p} />)}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[20vw] font-black text-white/[0.02] leading-none tracking-tighter" translate="no">ポケモン</span>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="animate-fade-in mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-800/40 text-red-300 text-sm font-medium backdrop-blur-sm">
              <span translate="no">🇯🇵 シールド専門店</span>&nbsp;·&nbsp;Import direct du Japon
            </span>
          </div>

          <h1 className="animate-fade-in-up delay-100 text-7xl md:text-9xl font-black leading-none mb-2 tracking-tight">
            <span className="shimmer-text">PokeJap</span>
          </h1>

          <p className="animate-fade-in-up delay-200 text-2xl text-white/30 font-light mb-4 tracking-widest" translate="no">
            ポケモンカード
          </p>

          <p className="animate-fade-in-up delay-300 text-gray-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Displays, coffrets et cartes japonaises scellés — introuvables en France,
            importés directement du Japon pour les vrais collectionneurs.
          </p>

          <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scelles" className="group px-8 py-4 bg-pokemon-red hover:bg-red-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-950/60 flex items-center gap-2 justify-center">
              <span>Voir les scellés</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/boutique" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-2xl transition-all duration-300">
              Singles japonais
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{height: '80px'}}>
          <div style={{width: '200%', animation: 'wave-move 8s linear infinite'}}>
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'50%',float:'left'}}>
              <path d="M0 40 C240 0 480 80 720 40 C960 0 1200 80 1440 40 L1440 80 L0 80 Z" fill="#0A0A14"/>
            </svg>
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'50%',float:'left'}}>
              <path d="M0 40 C240 0 480 80 720 40 C960 0 1200 80 1440 40 L1440 80 L0 80 Z" fill="#0A0A14"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ===== STATS SCELLÉS ===== */}
      <section className="py-10 px-4 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: `${displayCount}`, label: 'Displays japonais', emoji: '📦' },
            { value: `${coffretCount}`, label: 'Coffrets exclusifs', emoji: '🎀' },
            { value: `${cartesCount}`,  label: 'Cartes singles',     emoji: '🃏' },
          ].map(({ value, label, emoji }) => (
            <div key={label}>
              <p className="text-3xl font-black text-white mb-1">{emoji} {value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRODUITS SCELLÉS FEATURED ===== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-red-400 text-sm tracking-[0.3em] uppercase mb-2" translate="no">シールド</p>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                Produits <span className="shimmer-text">Scellés</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">Les sets les plus recherchés du moment</p>
            </div>
            <Link href="/scelles" className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap">
              Voir tout ({sealedProducts.length} produits)
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredSealed.map(product => {
              const typeColors: Record<string, string> = {
                display: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
                etb:     'text-purple-400 bg-purple-400/10 border-purple-400/30',
                coffret: 'text-green-400  bg-green-400/10  border-green-400/30',
              }
              const typeLabels: Record<string, string> = { display: '📦 Display', etb: '🎁 ETB', coffret: '🎀 Coffret' }
              const tc = typeColors[product.category ?? 'display']
              const tl = typeLabels[product.category ?? 'display']

              return (
                <Link key={product.id} href={`/scelles/${product.id}`}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d14] hover:border-pokemon-red/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/30 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover object-top scale-110 opacity-50 group-hover:opacity-65 group-hover:scale-115 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0d0d14]" />
                    <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm z-10 ${tc}`}>
                      {tl}
                    </span>
                    {product.stock > 0 ? (
                      <span className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full z-10">
                        <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" /> En stock
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 flex items-center gap-1 bg-gray-500/15 border border-gray-500/30 text-gray-400 text-[10px] font-bold px-2 py-1 rounded-full z-10">
                        Rupture de stock
                      </span>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-3 text-center pointer-events-none">
                      <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1" translate="no">{product.setCode}</span>
                      <span className="text-white font-black text-sm leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform duration-300 line-clamp-2">{product.set}</span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-4 gap-2">
                    <h3 className="text-white font-black text-sm leading-tight">{product.name}</h3>
                    <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2 flex-1">{product.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
                      <span className="text-pokemon-red font-black text-xl">{product.price.toFixed(2)} €</span>
                      <span className="text-gray-500 text-[11px]">Voir →</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/scelles" className="group inline-flex items-center gap-2 px-8 py-4 bg-pokemon-red hover:bg-red-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-950/60">
              Explorer tous les scellés
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GARANTIES ===== */}
      <section className="py-20 px-4 jp-pattern">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-400 text-sm tracking-[0.3em] uppercase mb-2" translate="no">なぜポケジャップ？</p>
            <h2 className="text-3xl font-black text-white">Pourquoi choisir <span className="shimmer-text">PokeJap</span> ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🇯🇵", kanji: "本物", titre: "100% Authentique", texte: "Produits importés directement du Japon. Chaque scellé est vérifié et authentifié avant l'envoi." },
              { icon: "📦", kanji: "安心", titre: "Emballage soigné", texte: "Vos displays et coffrets sont protégés avec soin pour arriver en parfait état, scellés sous cellophane officielle." },
              { icon: "🔒", kanji: "安全", titre: "Paiement sécurisé", texte: "Stripe, la référence mondiale en sécurité. Vos données bancaires ne transitent jamais par nos serveurs." },
            ].map((g, i) => (
              <div key={i} className="relative group bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-red-800/40 transition-all duration-500 hover:-translate-y-2 animate-border-glow card-shine">
                <div className="absolute top-4 right-4 text-white/5 text-5xl font-black leading-none select-none" translate="no">{g.kanji}</div>
                <div className="text-4xl mb-4">{g.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{g.titre}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{g.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SINGLES FEATURED ===== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-red-400 text-sm tracking-[0.3em] uppercase mb-2" translate="no">シングルカード</p>
              <h2 className="text-3xl font-black text-white">
                Singles <span className="shimmer-text">japonais</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">AR, SAR, ex, CHR — sleeve &amp; top loader inclus</p>
            </div>
            <Link href="/boutique" className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap">
              Voir toutes les cartes
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredSingles.map((p) => <ProductCard key={p.id} product={p} href="/boutique" />)}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-transparent to-yellow-950/10 rounded-3xl" />
          <div className="relative border border-red-900/20 rounded-3xl p-12">
            <div className="text-6xl mb-6 inline-block animate-float">📦</div>
            <h2 className="text-3xl font-black text-white mb-4">Prêt à ouvrir des boosters japonais ?</h2>
            <p className="text-gray-400 mb-8">
              {sealedProducts.length} produits scellés disponibles — displays &amp; coffrets introuvables en France.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scelles" className="inline-block px-10 py-4 bg-pokemon-yellow text-black font-black text-lg rounded-2xl hover:bg-yellow-300 transition-all duration-300 hover:scale-105 shadow-xl shadow-yellow-900/20">
                Voir les scellés
              </Link>
              <Link href="/boutique" className="inline-block px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all duration-300">
                Singles japonais
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
