import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'

export const metadata: Metadata = {
  title: 'PokeJap — Cartes Pokémon Japonaises',
  description: 'Boutique spécialisée en singles Pokémon japonais et français. Cartes authentiques importées directement du Japon.',
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
      style={{
        left,
        top: '-60px',
        animation: `sakura-fall ${duration} ${delay} linear infinite`,
        opacity,
        zIndex: 1,
      }}
    >
      <svg width={size} height={size * 1.1} viewBox="0 0 20 22" fill="none">
        <path d="M10 0C10 0 3 6 3 12C3 16.4 6.1 20 10 22C13.9 20 17 16.4 17 12C17 6 10 0 10 0Z" fill="#FFB7C5"/>
        <path d="M10 0C10 0 3 6 3 12C3 16.4 6.1 20 10 22" stroke="#FF8FAB" strokeWidth="0.5" fill="none"/>
      </svg>
    </div>
  )
}

export default function HomePage() {
  const featured = products.slice(0, 4)

  return (
    <div className="overflow-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">

        {/* Fond dégradé */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A14] via-[#120818] to-[#0A0A14]" />

        {/* Cercles lumineux */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-900/10 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-yellow-800/8 blur-[80px] animate-pulse" style={{animationDelay:'1.5s'}} />

        {/* Pétales de sakura */}
        {SAKURA_PETALS.map((p, i) => <SakuraPetal key={i} {...p} />)}

        {/* Texte japonais décoratif en arrière-plan */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[20vw] font-black text-white/[0.02] leading-none tracking-tighter" translate="no">
            ポケモン
          </span>
        </div>

        {/* Contenu hero */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="animate-fade-in mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-800/40 text-red-300 text-sm font-medium backdrop-blur-sm">
              <span translate="no">🇯🇵 カード専門店</span>&nbsp;·&nbsp; Import direct du Japon
            </span>
          </div>

          <h1 className="animate-fade-in-up delay-100 text-7xl md:text-9xl font-black leading-none mb-2 tracking-tight">
            <span className="shimmer-text">PokeJap</span>
          </h1>

          <p className="animate-fade-in-up delay-200 text-2xl text-white/30 font-light mb-4 tracking-widest" translate="no">
            ポケモンカード
          </p>

          <p className="animate-fade-in-up delay-300 text-gray-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Cartes Pokemon japonaises & francaises. Singles authentiques, 25 editions, toutes en etat neuf.
          </p>

          <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/boutique" className="group px-8 py-4 bg-pokemon-red hover:bg-red-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-950/60 flex items-center gap-2 justify-center">
              <span>Voir la boutique</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/a-propos" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-2xl transition-all duration-300">
              Notre histoire
            </Link>
          </div>
        </div>

        {/* Vague SVG en bas */}
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

      {/* ===== GARANTIES ===== */}
      <section className="py-20 px-4 jp-pattern">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-400 text-sm tracking-[0.3em] uppercase mb-2" translate="no">なぜポケジャップ？</p>
            <h2 className="text-3xl font-black text-white">Pourquoi choisir <span className="shimmer-text">PokeJap</span> ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🇯🇵", kanji: "本物", titre: "100% Authentique", texte: "Cartes importees directement du Japon. Chaque carte est verifiee et authentifiee avant la vente." },
              { icon: "📦", kanji: "安心", titre: "Expedition soignee", texte: "Pochette rigide + enveloppe renforcee pour chaque commande. Vos cartes arrivent en parfait etat." },
              { icon: "🔒", kanji: "安全", titre: "Paiement securise", texte: "Stripe, la reference mondiale en securite. Vos donnees bancaires ne transitent jamais par nos serveurs." },
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

      {/* ===== SELECTIONS ===== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-400 text-sm tracking-[0.3em] uppercase mb-2" translate="no">おすすめカード</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Selections <span className="shimmer-text">du moment</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} href="/boutique" />)}
          </div>
          <div className="text-center mt-12">
            <Link href="/boutique" className="group inline-flex items-center gap-2 px-8 py-4 bg-pokemon-red hover:bg-red-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-950/60">
              Voir toutes les cartes
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== EDITIONS ===== */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 via-transparent to-yellow-950/5" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-red-400 text-sm tracking-[0.3em] uppercase mb-2" translate="no">コレクション</p>
          <h2 className="text-3xl font-black text-white mb-3">25 editions disponibles</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            Des sets japonais vintage aux editions Scarlet & Violet les plus recentes.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Base Set","Jungle","Fossil","Team Rocket","Neo Genesis","Skyridge","ex Series","Diamond & Pearl","HeartGold SoulSilver","Black & White","XY","Sun & Moon","Sword & Shield","Scarlet & Violet","151","Eevee Heroes","Vmax Climax","Shiny Treasure","Mask of Change","Ancient Roar"].map((set, i) => (
              <span key={i} className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-lg text-sm text-gray-300 hover:border-red-700/50 hover:text-white hover:bg-red-950/20 transition-all duration-200 cursor-default">
                {set}
              </span>
            ))}
            <span className="px-3 py-1.5 bg-red-900/20 border border-red-700/30 rounded-lg text-sm text-red-400">+5 autres...</span>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-transparent to-yellow-950/10 rounded-3xl" />
          <div className="relative border border-red-900/20 rounded-3xl p-12">
            <div className="text-6xl mb-6 inline-block animate-float">🃏</div>
            <h2 className="text-3xl font-black text-white mb-4">Pret a completer ta collection ?</h2>
            <p className="text-gray-400 mb-8">Plus de 200 singles disponibles, toutes editions confondues.</p>
            <Link href="/boutique" className="inline-block px-10 py-4 bg-pokemon-yellow text-black font-black text-lg rounded-2xl hover:bg-yellow-300 transition-all duration-300 hover:scale-105 shadow-xl shadow-yellow-900/20">
              Parcourir la boutique
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
