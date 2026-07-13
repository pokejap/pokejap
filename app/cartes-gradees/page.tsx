'use client'

import { useState } from 'react'

const PSA_CARDS = [
  {
    id: 'psa-mega-dragonite-ex-m2a-232',
    name: 'Mega Dragonite ex',
    numero: '#232',
    set: 'MEGA Dream ex',
    setCode: 'M2A',
    grade: 9,
    price: 49.90,
    rarity: 'SAR',
    langue: 'Japonaise',
    image: 'https://den-cards.pokellector.com/427/Mega-Dragonite-ex.M2A.232.60100.png',
    description: 'Illustration spectaculaire de Dragonite en forme Mega, certifiée PSA 9 (Mint). Super Art Rare parmi les plus recherchées du set japonais MEGA Dream ex, sorti en 2025. L\'illustration pleine page en fait une pièce maîtresse pour tout collectionneur sérieux.',
  },
  {
    id: 'psa-mega-froslass-ex-m2a-224',
    name: 'Mega Froslass ex',
    numero: '#224',
    set: 'MEGA Dream ex',
    setCode: 'M2A',
    grade: 9,
    price: 42.90,
    rarity: 'SAR',
    langue: 'Japonaise',
    image: 'https://den-cards.pokellector.com/427/Mega-Froslass-ex.M2A.224.60094.png',
    description: 'Froslass en version Mega dans une illustration envoûtante aux teintes glacées. Super Art Rare parmi les plus appréciées du set MEGA Dream ex. Certifiée PSA 9 Mint — un incontournable pour les amateurs de Pokémon de la génération IV.',
  },
  {
    id: 'psa-flygon-ar-m2-088',
    name: 'Flygon AR',
    numero: '#088',
    set: 'Inferno X',
    setCode: 'M2',
    grade: 9,
    price: 34.90,
    rarity: 'AR',
    langue: 'Japonaise',
    image: 'https://den-cards.pokellector.com/425/Flygon.M2.88.59575.png',
    description: 'Flygon dans une illustration Alternative Rare dynamique du set Inferno X. Le Pokémon Dragon est représenté dans une pose épique. Certifiée PSA 9 — état quasi-parfait vérifié par les experts PSA, la référence mondiale du grading.',
  },
  {
    id: 'psa-pikachu-fa-25th-001',
    name: 'Pikachu Full Art 25th',
    numero: '#001/028',
    set: '25th Anniversary Collection',
    setCode: 'S8A',
    grade: 9,
    price: 34.90,
    rarity: 'Full Art',
    langue: 'Japonaise',
    image: 'https://den-cards.pokellector.com/327/Pikachu.S8A.1.39585.png',
    description: 'Pikachu commémoratif du 25ème anniversaire du Pokémon TCG. Full Art iconique recherchée par les collectionneurs du monde entier pour son illustration dorée et festive. Un symbole fort de l\'histoire Pokémon, certifié PSA 9 Mint.',
  },
  {
    id: 'psa-mega-gengar-ex-mbg-003',
    name: 'Mega Gengar ex',
    numero: '#003/021',
    set: 'MEGA Starter Set Mega Gengar ex',
    setCode: 'MBG',
    grade: 9,
    price: 34.90,
    rarity: 'Holo',
    langue: 'Japonaise',
    image: 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/MBG/MBG_3_R_JP_LG.png',
    description: 'Mega Gengar ex issue du MEGA Starter Set exclusif sorti en septembre 2025, contenant seulement 21 cartes au total. Très difficile à trouver hors du Japon. La capacité "Shadow Hiding" en fait aussi une pièce redoutable en jeu. Certifiée PSA 9 Mint.',
  },
  {
    id: 'psa-vaporeon-gx-smi-007',
    name: 'Vaporeon GX',
    numero: '#007/038',
    set: 'Eevee GX Starter Set',
    setCode: 'SMI',
    grade: 9,
    price: 44.90,
    rarity: 'GX',
    langue: 'Japonaise',
    image: 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SMI/SMI_7_R_JP_LG.png',
    description: 'Vaporeon GX issue du Eevee GX Starter Set (Sun & Moon, 2018) — set starter japonais parmi les plus difficiles à dénicher en bon état. L\'évolution aquatique d\'Évoli avec 210 PV. Très rare en PSA 9, idéale pour un collectionneur exigeant.',
  },
  {
    id: 'psa-cynthia-spiritomb-ar-m2a-208',
    name: 'Spiritomb de Cynthia AR',
    numero: '#208',
    set: 'MEGA Dream ex',
    setCode: 'M2A',
    grade: 9,
    price: 32.90,
    rarity: 'AR',
    langue: 'Japonaise',
    image: 'https://den-cards.pokellector.com/427/Cynthias-Spiritomb.M2A.208.60082.png',
    description: 'Illustration Alternative Rare de Spiritomb accompagné de Cynthia, la Grande Championne la plus emblématique de la saga. Issue du set MEGA Dream ex, cette carte mêle nostalgie et art saisissant dans un format illustré plein cadre. PSA 9 Mint.',
  },
  {
    id: 'psa-xerneas-ex-s8ap-023',
    name: 'Xerneas EX Full Art 25th',
    numero: '#023/025',
    set: '25th Anniversary Promo Pack',
    setCode: 'S8AP',
    grade: 9,
    price: 54.90,
    rarity: 'Full Art',
    langue: 'Japonaise',
    image: 'https://den-cards.pokellector.com/328/Xerneas-EX.S8A-P.23.40649.png',
    description: 'Xerneas EX Full Art issue du 25th Anniversary Promo Pack — set promo japonais limité à seulement 25 cartes pour le 25ème anniversaire du TCG. Extrêmement rare hors du Japon et quasi impossible à obtenir en état parfait. PSA 9 Mint.',
  },
  {
    id: 'psa-kangaskhan-ar-sv10-110',
    name: 'Kangaskhan AR',
    numero: '#110/98',
    set: 'Glory of Team Rocket',
    setCode: 'SV10',
    grade: 9,
    price: 32.90,
    rarity: 'AR',
    langue: 'Japonaise',
    image: 'https://den-cards.pokellector.com/413/Kangaskhan.SV10.110.57129.png',
    description: 'Kangaskhan dans une illustration Alternative Rare du set Glory of Team Rocket (SV10) — le grand retour de la Team Rocket dans Scarlet & Violet. Illustration chaleureuse pour l\'un des Pokémon les plus nostalgiques de la gen 1, avec son bébé. PSA 9 Mint.',
  },
]

const RARITY_COLORS: Record<string, string> = {
  'SAR':      'bg-purple-500/20 text-purple-300 border border-purple-500/40',
  'AR':       'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  'Full Art': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
  'GX':       'bg-pink-500/20 text-pink-300 border border-pink-500/40',
  'Holo':     'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
  'ex':       'bg-red-500/20 text-red-300 border border-red-500/40',
}

interface PSACard {
  id: string; name: string; numero: string; set: string; setCode: string
  grade: number; price: number; rarity: string; langue: string; image: string; description: string
}

// ─── Visuel dalle PSA ─────────────────────────────────────────────────────────
function PSASlab({ card, size = 'sm' }: { card: PSACard; size?: 'sm' | 'lg' }) {
  const [imgError, setImgError] = useState(false)
  const isLg = size === 'lg'

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #d6d6d6 0%, #f0f0f0 40%, #c2c2c2 100%)',
        padding: isLg ? '10px' : '5px',
        borderRadius: isLg ? '10px' : '6px',
        boxShadow: isLg
          ? '0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.6)'
          : '0 6px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.5)',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #e0e0e0 0%, #f5f5f5 100%)',
          borderRadius: isLg ? '6px' : '3px',
          padding: isLg ? '6px' : '3px',
          display: 'flex',
          flexDirection: 'column',
          gap: isLg ? '6px' : '3px',
        }}
      >
        {/* Card image */}
        <div
          style={{
            background: '#111',
            borderRadius: isLg ? '4px' : '2px',
            overflow: 'hidden',
            aspectRatio: '63/88',
          }}
        >
          {card.image && !imgError ? (
            <img
              src={card.image}
              alt={card.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: isLg ? '48px' : '24px' }}>
              🃏
            </div>
          )}
        </div>

        {/* PSA label */}
        <div style={{ background: 'white', borderRadius: isLg ? '3px' : '2px', overflow: 'hidden' }}>
          {/* Red stripe */}
          <div style={{ background: '#cc0000', height: isLg ? '8px' : '4px' }} />
          {/* Label body */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', padding: isLg ? '5px 8px' : '2px 4px', gap: isLg ? '6px' : '2px' }}>
            {/* Left col */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 900, fontSize: isLg ? '8px' : '4px', color: '#111', letterSpacing: '0.03em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>JPN. POKÉMON TCG</div>
              <div style={{ fontWeight: 700, fontSize: isLg ? '8px' : '4px', color: '#111', marginTop: isLg ? '2px' : '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.name}</div>
              <div style={{ fontSize: isLg ? '7px' : '3.5px', color: '#444', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.set}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: isLg ? '4px' : '2px', marginTop: isLg ? '4px' : '2px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: isLg ? '7px' : '3.5px', letterSpacing: isLg ? '-0.5px' : '-0.2px', color: '#222' }}>|||||||||||||||||</div>
                <div style={{ fontWeight: 900, fontSize: isLg ? '9px' : '4.5px', color: '#cc0000', letterSpacing: '0.05em' }}>PSA</div>
              </div>
            </div>
            {/* Right col */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ fontSize: isLg ? '6px' : '3px', color: '#888' }}>{card.numero}</div>
              <div style={{ fontSize: isLg ? '7px' : '3.5px', fontWeight: 700, color: '#111', textTransform: 'uppercase' }}>MINT</div>
              <div style={{ fontSize: isLg ? '28px' : '14px', fontWeight: 900, color: '#111', lineHeight: 1 }}>{card.grade}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Carte dans la grille ─────────────────────────────────────────────────────
function PSACardItem({ card, onOpen }: { card: PSACard; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="group flex flex-col rounded-xl border border-white/10 bg-[#111] overflow-hidden hover:border-white/25 transition-all duration-200 cursor-pointer hover:shadow-xl"
    >
      {/* Slab */}
      <div className="bg-[#0a0a0a] p-3 transition-transform duration-300 group-hover:scale-[1.02]">
        <PSASlab card={card} size="sm" />
      </div>

      {/* Infos */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-start justify-between gap-1">
          <h3 className="text-sm font-semibold text-white leading-tight">{card.name}</h3>
          <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${RARITY_COLORS[card.rarity] ?? 'bg-white/10 text-white/60'}`}>
            {card.rarity}
          </span>
        </div>
        <p className="text-xs text-white/40 truncate">{card.set}</p>
        <p className="text-base font-bold text-yellow-400 mt-auto pt-1">{card.price.toFixed(2)} €</p>
      </div>
    </div>
  )
}

// ─── Page détail — plein écran style boutique ─────────────────────────────────
function PSADetail({ card, onClose }: { card: PSACard; onClose: () => void }) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    try {
      const stored = localStorage.getItem('pokejap-cart')
      const cart = stored ? JSON.parse(stored) : []
      const exists = cart.find((i: { id: string }) => i.id === card.id)
      if (!exists) {
        cart.push({ id: card.id, name: card.name, price: card.price, image: card.image, quantity: 1, set: card.set, rarity: card.rarity, grade: `PSA ${card.grade}` })
        localStorage.setItem('pokejap-cart', JSON.stringify(cart))
      }
    } catch {}
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
      {/* Barre retour */}
      <div className="border-b border-white/10 px-6 py-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
        >
          ← Retour aux cartes gradées
        </button>
      </div>

      {/* Layout deux colonnes */}
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-12">

        {/* Colonne gauche — slab PSA */}
        <div className="md:w-[380px] shrink-0 flex items-start justify-center">
          <div className="w-full max-w-[340px]">
            <PSASlab card={card} size="lg" />
          </div>
        </div>

        {/* Colonne droite — infos */}
        <div className="flex-1 flex flex-col gap-5">

          {/* Nom + badge */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-white leading-tight">{card.name}</h1>
            <span className={`shrink-0 text-sm px-3 py-1 rounded-full font-semibold ${RARITY_COLORS[card.rarity] ?? 'bg-white/10 text-white/60'}`}>
              {card.rarity}
            </span>
          </div>

          {/* Grille infos */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Extension', card.set],
              ['Numéro', card.numero],
              ['Type', 'N/A'],
              ['PV', 'N/A'],
            ].map(([label, val]) => (
              <div key={label} className="rounded-xl bg-white/5 border border-white/8 px-4 py-3">
                <div className="text-xs text-white/40 mb-1">{label}</div>
                <div className="font-semibold text-white">{val}</div>
              </div>
            ))}
          </div>

          {/* État de la carte */}
          <div className="rounded-xl bg-white/5 border border-white/8 px-4 py-4">
            <div className="text-xs text-white/40 mb-2">Etat de la carte</div>
            <div className="font-bold text-white mb-1">PSA {card.grade} — Mint</div>
            <div className="text-sm text-white/50 leading-relaxed">{card.description}</div>
          </div>

          <p className="text-sm text-white/40">Dalle PSA officielle incluse · Authentique et certifiée</p>

          {/* Prix + stock */}
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-yellow-400">{card.price.toFixed(2)} €</span>
            <span className="text-sm text-orange-400 font-medium">Plus que 1 en stock !</span>
          </div>

          {/* Bouton */}
          <button
            onClick={handleAdd}
            className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] ${
              added ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            {added ? '✓ Ajouté au panier' : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Ajouter au panier
              </>
            )}
          </button>

          {/* Badges confiance */}
          <div className="flex justify-around pt-4 border-t border-white/10">
            {[
              ['🛡️', 'Authentique'],
              ['📦', 'Emballage soigné'],
              ['🔒', 'Paiement sécurisé'],
            ].map(([icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs text-white/40">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function CartesGradeesPage() {
  const [selectedCard, setSelectedCard] = useState<PSACard | null>(null)

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-16 px-6 text-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black text-xs font-black px-3 py-1.5 rounded-full mb-4 shadow-lg">
            PSA CERTIFIED
          </div>
          <h1 className="text-4xl font-bold mb-3">グレードカード</h1>
          <p className="text-xl font-semibold text-white mb-2">Cartes Gradées PSA</p>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            Cartes japonaises rares certifiées et notées par PSA — l&apos;autorité mondiale du grading.
            Chaque carte est encapsulée dans une dalle PSA officielle.
          </p>
          <div className="mt-6 flex justify-center gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">{PSA_CARDS.length}</div>
              <div className="text-xs text-white/40 mt-0.5">Cartes disponibles</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-yellow-400">🇯🇵</div>
              <div className="text-xs text-white/40 mt-0.5">100% Japonaises</div>
            </div>
          </div>
        </div>
      </section>

      {/* Grille */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PSA_CARDS.map(card => (
            <PSACardItem key={card.id} card={card} onOpen={() => setSelectedCard(card)} />
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedCard && (
        <PSADetail card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}

      {/* PSA info */}
      <section className="border-t border-white/10 bg-white/[0.02] py-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg font-semibold text-white mb-2">Qu&apos;est-ce que le grading PSA ?</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            PSA (Professional Sports Authenticator) est le leader mondial de la certification de cartes à collectionner.
            Chaque carte est examinée par des experts, notée de 1 à 10, puis encapsulée dans une dalle inviolable.
            Une note PSA 9 (Mint) signifie que la carte est en état quasi-parfait.
          </p>
        </div>
      </section>
    </main>
  )
}
