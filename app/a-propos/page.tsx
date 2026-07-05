'use client'
import { useState } from 'react'
import PokejapLogo from '@/components/PokejapLogo'

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
            À propos de <span className="shimmer-text">PokeJap</span>
          </h1>
          <p className="text-gray-400">Une boutique née de la passion pour le Japon et Pokémon.</p>
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
                  <div className="shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-red-900/60 to-red-950 border border-red-800/30 flex items-center justify-center shadow-lg">
                    <PokejapLogo size={48} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-white font-black text-xl mb-1">Le fondateur de PokeJap</h2>
                    <p className="text-red-400 text-sm mb-3 tracking-wide">Collectionneur & vendeur</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Passionné de cartes Pokémon depuis toujours, j'ai commencé à importer des cartes japonaises pour ma propre collection avant de décider de partager cette passion avec d'autres collectionneurs français.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 card-shine">
                <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <span>🌸</span> Mon histoire avec Pokémon
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  Tout a commencé par une fascination pour les éditions japonaises : leurs designs exclusifs, la qualité d'impression supérieure, et le fait qu'elles sortent en avance sur le reste du monde. Chaque carte japonaise raconte une histoire directement depuis le Japon.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Aujourd'hui, PokeJap c'est plus de 100 singles sélectionnés à la main et une quarantaine de displays et coffrets scellés issus des meilleures éditions japonaises. Toutes mes cartes sont en état Neuf — je ne vends que ce que j'achèterais moi-même.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span>🎌</span> Pourquoi le Japon ?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { emoji: '🇯🇵', titre: 'Source originale', texte: "Le Japon est le berceau de Pokémon. Les cartes y sont faites avec un soin particulier." },
                    { emoji: '⚡', titre: 'Sorties en avance', texte: "Les éditions japonaises sortent avant la France, parfois avec des cartes exclusives." },
                    { emoji: '🎨', titre: 'Designs uniques', texte: "Certaines éditions japonaises n'existent pas en français ou en anglais." },
                    { emoji: '✨', titre: 'Qualité supérieure', texte: "Impression et finition souvent plus nettes que les éditions occidentales." },
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
                { kanji: "使命", icon: "✨", titre: "Notre mission", texte: "Proposer des produits Pokémon authentiques, en excellent état, à des prix justes. Pas de surprise, pas de mauvaise expérience — juste des produits de qualité livrés avec soin." },
                { kanji: "品質", icon: "📦", titre: "Notre engagement qualité", texte: "Chaque display et coffret est vérifié avant expédition. Emballage soigné pour garantir l'arrivée en parfait état, scellé sous cellophane officielle. Nous travaillons exclusivement avec des fournisseurs de confiance établis au Japon." },
                { kanji: "誠実", icon: "🤝", titre: "Notre promesse", texte: "Si un produit ne correspond pas à sa description ou arrive endommagé, nous trouvons toujours une solution. La satisfaction du client est notre priorité absolue." },
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
                  Plus de 100 singles issus des meilleures éditions japonaises, plus de 40 displays et coffrets scellés. Toutes les cartes sont en état Neuf sauf mention contraire sur la fiche produit.
                </p>
                <div className="grid grid-cols-3 gap-3 text-center mb-6">
                  {[
                    { nb: '100+', label: 'Singles disponibles' },
                    { nb: '40+',  label: 'Displays & coffrets' },
                    { nb: '100%', label: 'Produits neufs' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-red-950/20 border border-red-900/20 rounded-xl p-4">
                      <p className="text-2xl font-black shimmer-text">{stat.nb}</p>
                      <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <h3 className="text-white font-semibold mb-3 text-sm">Éditions disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {["Scarlet & Violet","151","Heat Wave Arena","MEGA Dream ex","Terastal Festival ex","Shiny Treasure ex","Battle Partners","Stellar Crown","Paradis Dragona","VSTAR Universe","Vmax Climax","Lost Abyss","Paradigm Trigger","Star Birth","Dark Phantasma"].map((set, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.07] rounded-lg text-xs text-gray-300 hover:border-red-700/40 hover:text-white transition-colors">
                      {set}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 bg-red-900/20 border border-red-700/30 rounded-lg text-xs text-red-400">+25 autres...</span>
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
                      <p className="text-white text-sm font-semibold">Temps de réponse</p>
                      <p className="text-gray-400 text-sm">Sous 24h en moyenne</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/30 flex items-center justify-center text-lg">🌐</div>
                    <div>
                      <p className="text-white text-sm font-semibold">Langue</p>
                      <p className="text-gray-400 text-sm">Français & Anglais</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-950/20 to-transparent border border-red-900/20 rounded-2xl p-8 text-center">
                <h3 className="text-white font-bold text-lg mb-2">Une question sur un produit ?</h3>
                <p className="text-gray-400 text-sm mb-5">N'hésitez pas à demander des photos supplémentaires ou des précisions sur l'état d'un produit.</p>
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
