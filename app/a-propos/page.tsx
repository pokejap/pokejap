'use client'
import { useState } from 'react'
import PokejapLogo from '@/components/PokejapLogo'

// Metadata ne fonctionne pas dans les 'use client' — on le met dans un layout dédié si besoin
// Pour l'instant le titre global suffit

const TABS = [
  { id: 'nous',      label: 'Qui sommes-nous', icon: '👤' },
  { id: 'mission',   label: 'Notre mission',   icon: '🎯' },
  { id: 'catalogue', label: 'Catalogue',       icon: '🃏' },
  { id: 'contact',   label: 'Contact',         icon: '📧' },
]

export default function AProposPage() {
  const [activeTab, setActiveTab] = useState('nous')

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-red-400 text-sm tracking-[0.3em] uppercase mb-3">私たちについて</p>
          <h1 className="text-5xl font-black text-white mb-4">
            A propos de <span className="shimmer-text">PokeJap</span>
          </h1>
          <p className="text-gray-400">Une boutique nee de la passion pour le Japon et Pokemon.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-pokemon-red text-white shadow-lg shadow-red-900/40'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <div className="animate-fade-in">

          {/* === QUI SOMMES-NOUS === */}
          {activeTab === 'nous' && (
            <div className="space-y-6">
              {/* Carte profil */}
              <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 card-shine">
                <div className="absolute top-4 right-6 text-6xl font-black text-white/[0.03] select-none">私</div>
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Avatar placeholder */}
                  <div className="shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-red-900/60 to-red-950 border border-red-800/30 flex items-center justify-center shadow-lg">
                    <PokejapLogo size={48} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-white font-black text-xl mb-1">Le fondateur de PokeJap</h2>
                    <p className="text-red-400 text-sm mb-3 tracking-wide">Collectionneur & vendeur</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Passionne de cartes Pokemon depuis toujours, j'ai commence a importer des cartes japonaises pour ma propre collection avant de decider de partager cette passion avec d'autres collectionneurs francais.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 card-shine">
                <div className="absolute top-4 right-6 text-6xl font-black text-white/[0.03] select-none">夢</div>
                <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <span>🌸</span> Mon histoire avec Pokemon
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  Tout a commence par une fascination pour les editions japonaises : leurs designs exclusifs, la qualite d'impression superieure, et le fait qu'elles sortent en avance sur le reste du monde. Chaque carte japonaise raconte une histoire directement depuis le Japon.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Aujourd'hui, PokeJap c'est plus de 200 singles selectionnes a la main, issus de 25 editions differentes. Toutes mes cartes sont en etat Neuf — je ne vends que ce que j'acheterais moi-meme.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span>🎌</span> Pourquoi le Japon ?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { emoji: '🇯🇵', titre: 'Source originale', texte: "Le Japon est le berceau de Pokemon. Les cartes y sont faites avec un soin particulier." },
                    { emoji: '⚡', titre: 'Sorties en avance', texte: "Les editions japonaises sortent avant la France, parfois avec des cartes exclusives." },
                    { emoji: '🎨', titre: 'Designs uniques', texte: "Certaines editions japonaises n'existent pas en francais ou en anglais." },
                    { emoji: '✨', titre: 'Qualite superieure', texte: "Impression et finition souvent plus nettes que les editions occidentales." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <p className="text-white text-sm font-semibold">{item.titre}</p>
                        <p className="text-gray-500 text-xs leading-relaxed">{item.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === MISSION === */}
          {activeTab === 'mission' && (
            <div className="space-y-6">
              {[
                { kanji: "使命", icon: "✨", titre: "Notre mission", texte: "Proposer des cartes Pokemon authentiques, en excellent etat, a des prix justes. Pas de surprise, pas de mauvaise experience — juste des cartes de qualite livrees avec soin." },
                { kanji: "品質", icon: "📦", titre: "Notre engagement qualite", texte: "Chaque carte est verifiee et photographiee avant la mise en vente. Expedition dans des pochettes rigides, protegees dans des enveloppes renforcees. Nous travaillons exclusivement avec des fournisseurs de confiance etablis au Japon." },
                { kanji: "誠実", icon: "🤝", titre: "Notre promesse", texte: "Si une carte ne correspond pas a sa description ou arrive endommagee, nous trouvons toujours une solution. La satisfaction du client est notre priorite absolue." },
              ].map((item, i) => (
                <div key={i} className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 card-shine hover:border-red-800/30 transition-all duration-300">
                  <div className="absolute top-4 right-6 text-6xl font-black text-white/[0.04] select-none">{item.kanji}</div>
                  <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>{item.icon}</span> {item.titre}
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-sm">{item.texte}</p>
                </div>
              ))}
            </div>
          )}

          {/* === CATALOGUE === */}
          {activeTab === 'catalogue' && (
            <div className="space-y-6">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🃏</span> Notre catalogue
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Pres de 200 singles issus de 25 editions differentes, principalement japonaises. Toutes en etat Neuf sauf mention contraire sur la fiche produit.
                </p>
                <div className="grid grid-cols-3 gap-3 text-center mb-6">
                  {[
                    { nb: '200+', label: 'Singles disponibles' },
                    { nb: '25',   label: 'Editions differentes' },
                    { nb: '100%', label: 'Cartes neuves' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-red-950/20 border border-red-900/20 rounded-xl p-4">
                      <p className="text-2xl font-black shimmer-text">{stat.nb}</p>
                      <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <h3 className="text-white font-semibold mb-3 text-sm">Editions disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {["Base Set","Jungle","Fossil","Team Rocket","Neo Genesis","ex Series","Diamond & Pearl","HeartGold SoulSilver","Black & White","XY","Sun & Moon","Sword & Shield","Scarlet & Violet","151","Eevee Heroes","Vmax Climax","Shiny Treasure","Mask of Change","Ancient Roar"].map((set, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.07] rounded-lg text-xs text-gray-300 hover:border-red-700/40 hover:text-white transition-colors">
                      {set}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 bg-red-900/20 border border-red-700/30 rounded-lg text-xs text-red-400">+6 autres...</span>
                </div>
              </div>
            </div>
          )}

          {/* === CONTACT === */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📧</span> Nous contacter
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/30 flex items-center justify-center text-lg">📧</div>
                    <div>
                      <p className="text-white text-sm font-semibold">Email</p>
                      <a href="mailto:contact@pokejap.fr" className="text-red-400 hover:text-red-300 text-sm transition-colors">contact@pokejap.fr</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/30 flex items-center justify-center text-lg">⏱️</div>
                    <div>
                      <p className="text-white text-sm font-semibold">Temps de reponse</p>
                      <p className="text-gray-400 text-sm">Sous 24h en moyenne</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/30 flex items-center justify-center text-lg">🌐</div>
                    <div>
                      <p className="text-white text-sm font-semibold">Langue</p>
                      <p className="text-gray-400 text-sm">Francais & Anglais</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-950/20 to-transparent border border-red-900/20 rounded-2xl p-8 text-center">
                <h3 className="text-white font-bold text-lg mb-2">Une question sur une carte ?</h3>
                <p className="text-gray-400 text-sm mb-5">N'hesitez pas a demander des photos supplementaires ou des precisions sur l'etat d'une carte.</p>
                <a href="mailto:contact@pokejap.fr" className="inline-flex items-center gap-2 px-6 py-3 bg-pokemon-red hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                  Envoyer un message
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
