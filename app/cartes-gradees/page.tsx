'use client'

import { useState } from 'react'

const PSA_CARDS = [
  {
    id: 'psa-mega-dragonite-ex-m2a-232',
    name: 'Mega Dragonite ex',
    numero: '#232',
    set: 'MEGA Dream ex (M2A)',
    setCode: 'M2A',
    grade: 9,
    price: 49.90,
    rarity: 'SAR',
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/427/Mega-Dragonite-ex.M2A.232.60100.png',
    description: 'Illustration spectaculaire de Dragonite en forme Mega, certifiée PSA 9 (Mint) — état quasi-parfait garanti. Super Art Rare parmi les plus recherchées du set japonais MEGA Dream ex, sorti en 2025. L\'illustration pleine page de cette carte en fait l\'une des pièces maîtresses de la collection. Encapsulée dans une dalle PSA officielle et inviolable.',
  },
  {
    id: 'psa-mega-froslass-ex-m2a-224',
    name: 'Mega Froslass ex',
    numero: '#224',
    set: 'MEGA Dream ex (M2A)',
    setCode: 'M2A',
    grade: 9,
    price: 42.90,
    rarity: 'SAR',
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/427/Mega-Froslass-ex.M2A.224.60094.png',
    description: 'Froslass en version Mega dans une illustration envoûtante aux teintes glacées — Super Art Rare parmi les plus appréciées du set MEGA Dream ex. Certifiée PSA 9 Mint, cette carte est un incontournable pour les amateurs de Pokémon de la génération IV. Dalle PSA officielle, authentique et inviolable.',
  },
  {
    id: 'psa-flygon-ar-m2-088',
    name: 'Flygon AR',
    numero: '#088',
    set: 'Inferno X (M2)',
    setCode: 'M2',
    grade: 9,
    price: 34.90,
    rarity: 'AR',
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/425/Flygon.M2.88.59575.png',
    description: 'Flygon dans une illustration Alternative Rare dynamique issue du set Inferno X (M2). Le Pokémon Dragon est représenté dans une pose épique, entouré de flammes et d\'énergie. Certifiée PSA 9 — état quasi-parfait vérifié par les experts PSA, la référence mondiale du grading.',
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
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/327/Pikachu.S8A.1.39585.png',
    description: 'Pikachu commémoratif du 25ème anniversaire du Pokémon TCG — la carte #001 du set S8A 25th Anniversary Collection. Full Art iconique recherchée par les collectionneurs du monde entier pour son illustration dorée et festive. Un symbole fort de l\'histoire Pokémon, certifié PSA 9 Mint.',
  },
  {
    id: 'psa-mega-gengar-ex-mbg-003',
    name: 'Mega Gengar ex',
    numero: '#003/021',
    set: 'MEGA Starter Set Mega Gengar ex (MBG)',
    setCode: 'MBG',
    grade: 9,
    price: 34.90,
    rarity: 'Holo',
    langue: 'JPN',
    image: 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/MBG/MBG_3_R_JP_LG.png',
    description: 'Mega Gengar ex issue du MEGA Starter Set Mega Gengar ex (MBG) — set starter japonais exclusif sorti en septembre 2025, contenant seulement 21 cartes au total. Carte très difficile à trouver en état parfait hors du Japon. La capacité "Shadow Hiding" de ce Mega Gengar ex en fait également une pièce redoutable en jeu. Certifiée PSA 9 Mint.',
  },
  {
    id: 'psa-vaporeon-gx-smi-007',
    name: 'Vaporeon GX',
    numero: '#007/038',
    set: 'Eevee GX Starter Set (SMI)',
    setCode: 'SMI',
    grade: 9,
    price: 44.90,
    rarity: 'GX',
    langue: 'JPN',
    image: 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/SMI/SMI_7_R_JP_LG.png',
    description: 'Vaporeon GX issue du Eevee GX Starter Set (Sun & Moon, 2018) — set starter japonais collector parmi les plus difficiles à dénicher en bon état, bien que sorti en 2018. L\'évolution aquatique d\'Évoli est représentée dans toute sa puissance avec 210 PV. Très rare de trouver cette carte en PSA 9, elle est idéale pour un collectionneur exigeant.',
  },
  {
    id: 'psa-cynthia-spiritomb-ar-m2a-208',
    name: 'Spiritomb de Cynthia AR',
    numero: '#208',
    set: 'MEGA Dream ex (M2A)',
    setCode: 'M2A',
    grade: 9,
    price: 32.90,
    rarity: 'AR',
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/427/Cynthias-Spiritomb.M2A.208.60082.png',
    description: 'Illustration Alternative Rare de Spiritomb accompagné de Cynthia, l\'une des Grandes Championnes les plus emblématiques de la saga Pokémon. Issue du set MEGA Dream ex, cette carte mêle nostalgie et art saisissant dans un format illustré plein cadre. Un must-have pour les fans de Cynthia et de la génération IV. Certifiée PSA 9 Mint.',
  },
  {
    id: 'psa-xerneas-ex-s8ap-023',
    name: 'Xerneas EX Full Art 25th',
    numero: '#023/025',
    set: '25th Anniversary Promo Pack (S8AP)',
    setCode: 'S8AP',
    grade: 9,
    price: 54.90,
    rarity: 'Full Art',
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/328/Xerneas-EX.S8A-P.23.40649.png',
    description: 'Xerneas EX Full Art issue du 25th Anniversary Promo Pack (S8AP) — set promo japonais limité à seulement 25 cartes, sorti pour le 25ème anniversaire du Pokémon TCG. Extrêmement rare en dehors du Japon et quasi impossible à obtenir en état parfait. Cette carte représente Xerneas, le Pokémon Vie légendaire de la génération VI, dans une illustration somptueuse. PSA 9 Mint.',
  },
  {
    id: 'psa-kangaskhan-ar-sv10-110',
    name: 'Kangaskhan AR',
    numero: '#110/98',
    set: 'Glory of Team Rocket (SV10)',
    setCode: 'SV10',
    grade: 9,
    price: 32.90,
    rarity: 'AR',
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/413/Kangaskhan.SV10.110.57129.png',
    description: 'Kangaskhan dans une illustration Alternative Rare issue du set Glory of Team Rocket (SV10) — le grand retour de la Team Rocket dans le Pokémon TCG Scarlet & Violet. Une illustration chaleureuse et puissante pour l\'un des Pokémon les plus nostalgiques de la première génération, représenté avec son bébé. Certifiée PSA 9 Mint par les experts PSA.',
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

// ─── Dalle PSA réutilisable ───────────────────────────────────────────────────
function PSASlab({ card, large = false }: { card: PSACard; large?: boolean }) {
  const [imgError, setImgError] = useState(false)
  const pad = large ? '6px 6px 10px' : '4px 4px 7px'
  const labelPad = large ? '6px 10px 7px' : '3px 6px 5px'
  const stripe = large ? 8 : 5
  const fsSmall = large ? 10 : 6.5
  const fsName  = large ? 13 : 8.5
  const fsSet   = large ? 10 : 6.5
  const fsPSA   = large ? 11 : 7.5
  const fsNum   = large ? 10 : 6.5
  const fsMint  = large ? 10 : 6.5
  const fsGrade = large ? 44 : 28
  const bcH     = large ? 13 : 9

  const setShort = card.set.replace(/\s*\(.*?\)\s*/g, '').trim().toUpperCase()

  return (
    <div style={{ filter: `drop-shadow(0 ${large ? 20 : 10}px ${large ? 48 : 24}px rgba(0,0,0,0.65))` }}>
      {/* Coque plastique extérieure — gradient argenté 3D */}
      <div style={{
        background: 'linear-gradient(160deg,#e4e8ec 0%,#c2c9d2 18%,#dde2e7 36%,#b5bdc7 55%,#ccd1d8 72%,#a8b2bc 100%)',
        padding: pad,
        borderRadius: 6,
        boxShadow: [
          'inset 0 2px 3px rgba(255,255,255,0.85)',
          'inset 0 -2px 3px rgba(0,0,0,0.18)',
          'inset 2px 0 2px rgba(255,255,255,0.45)',
          'inset -2px 0 2px rgba(0,0,0,0.12)',
          '0 1px 0 rgba(255,255,255,0.25)',
        ].join(','),
      }}>
        {/* Fenêtre intérieure claire */}
        <div style={{
          overflow: 'hidden',
          borderRadius: 2,
          background: 'rgba(210,225,238,0.12)',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.07)',
        }}>

          {/* ── Étiquette blanche ── */}
          <div style={{ background: '#fff' }}>
            {/* Bande rouge */}
            <div style={{
              height: stripe,
              background: 'linear-gradient(180deg,#cf0000 0%,#a80000 100%)',
            }} />

            {/* Corps de l'étiquette */}
            <div style={{ display: 'flex', alignItems: 'flex-start', padding: labelPad, gap: 5 }}>

              {/* Colonne gauche */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: fsSmall, fontWeight: 700, color: '#111', letterSpacing: 0.3, lineHeight: 1.35, fontFamily: 'Arial,Helvetica,sans-serif' }}>
                  JPN. POKÉMON TCG
                </div>
                <div style={{ fontSize: fsName, fontWeight: 900, color: '#000', lineHeight: 1.2, fontFamily: 'Arial Black,Arial,sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {card.name.toUpperCase()}
                </div>
                <div style={{ fontSize: fsSet, color: '#333', lineHeight: 1.3, fontFamily: 'Arial,Helvetica,sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {setShort}
                </div>

                {/* Code barre + logo PSA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: large ? 5 : 3 }}>
                  <div style={{
                    height: bcH, flex: 1,
                    backgroundImage: 'repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 1px,transparent 2px,#000 2px,#000 3px,transparent 3px,transparent 5px,#000 5px,#000 6px,transparent 6px,transparent 8px)',
                    opacity: 0.45,
                  }} />
                  <span style={{ fontSize: fsPSA, fontWeight: 900, color: '#003fa3', fontStyle: 'italic', letterSpacing: 1.5, fontFamily: 'Georgia,Times New Roman,serif', flexShrink: 0 }}>
                    PSA
                  </span>
                </div>
              </div>

              {/* Colonne droite : numéro / MINT / grade */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, paddingTop: 1 }}>
                <span style={{ fontSize: fsNum, fontWeight: 700, color: '#111', lineHeight: 1.35, fontFamily: 'Arial,sans-serif' }}>
                  {card.numero}
                </span>
                <span style={{ fontSize: fsMint, fontWeight: 700, color: '#111', lineHeight: 1.35, fontFamily: 'Arial,sans-serif' }}>
                  MINT
                </span>
                <span style={{ fontSize: fsGrade, fontWeight: 900, color: '#000', lineHeight: 1, fontFamily: 'Arial Black,Impact,sans-serif', marginTop: 1 }}>
                  {card.grade}
                </span>
              </div>
            </div>
          </div>

          {/* ── Image carte ── */}
          <div style={{ position: 'relative', background: '#090909' }}>
            <div style={{ aspectRatio: '63/88' }}>
              {card.image && !imgError ? (
                <img
                  src={card.image}
                  alt={card.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', gap: 8 }}>
                  <span style={{ fontSize: large ? '3rem' : '2rem' }}>🃏</span>
                  <span style={{ fontSize: large ? '0.8rem' : '0.55rem', textAlign: 'center', padding: '0 8px' }}>{card.name}</span>
                </div>
              )}
            </div>
            {/* Reflet plastique */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(128deg,rgba(255,255,255,0.14) 0%,transparent 30%,rgba(255,255,255,0.04) 65%,transparent 100%)',
            }} />
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
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/30 transition-all duration-300 cursor-pointer hover:bg-white/[0.07]"
    >
      <div className="p-3 pb-2 transition-transform duration-500 group-hover:scale-[1.025]">
        <PSASlab card={card} />
      </div>

      <div className="flex flex-col gap-1 px-3 pb-3 flex-1">
        <div className="flex items-start justify-between gap-2 mt-1">
          <h3 className="font-semibold text-white text-sm leading-tight">{card.name}</h3>
          <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${RARITY_COLORS[card.rarity] ?? 'bg-white/10 text-white/60'}`}>
            {card.rarity}
          </span>
        </div>
        <p className="text-xs text-white/35 leading-tight truncate">🇯🇵 {card.set}</p>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-white font-bold">{card.price.toFixed(2)}€</span>
          <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors">Voir →</span>
        </div>
      </div>
    </div>
  )
}

// ─── Modal détail ─────────────────────────────────────────────────────────────
function PSAModal({ card, onClose }: { card: PSACard; onClose: () => void }) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 flex flex-col sm:flex-row gap-8 items-center sm:items-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all text-sm font-bold"
        >
          ✕
        </button>

        {/* Dalle PSA grande */}
        <div className="w-44 sm:w-52 shrink-0">
          <PSASlab card={card} large />
        </div>

        {/* Infos */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                PSA {card.grade} — MINT
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${RARITY_COLORS[card.rarity] ?? 'bg-white/10 text-white/60'}`}>
                {card.rarity}
              </span>
              <span className="text-xs text-white/40">🇯🇵 Japonaise</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">{card.name}</h2>
            <p className="text-white/45 text-sm mt-0.5">{card.set}</p>
          </div>

          {/* Grille infos */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ['Numéro', card.numero],
              ['Set', card.setCode],
              ['Grade PSA', `PSA ${card.grade}`],
              ['Langue', '🇯🇵 Japonais'],
            ].map(([label, val]) => (
              <div key={label} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/35 mb-0.5">{label}</div>
                <div className="text-white font-semibold">{val}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-white/55 text-sm leading-relaxed">{card.description}</p>

          {/* Prix + CTA */}
          <div className="flex items-center justify-between gap-4 mt-1">
            <span className="text-white font-bold text-2xl">{card.price.toFixed(2)}€</span>
            <button
              onClick={handleAdd}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 ${
                added ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              {added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
            </button>
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
          {PSA_CARDS.map((card) => (
            <PSACardItem key={card.id} card={card} onOpen={() => setSelectedCard(card)} />
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedCard && (
        <PSAModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}

      {/* Bloc confiance PSA */}
      <section className="border-t border-white/10 bg-white/[0.02] py-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg font-semibold text-white mb-2">Qu&apos;est-ce que le grading PSA ?</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            PSA (Professional Sports Authenticator) est le leader mondial de la certification de cartes à collectionner.
            Chaque carte est examinée par des experts, notée de 1 à 10, puis encapsulée dans une dalle inviolable.
            Une note PSA 9 (Mint) signifie que la carte est en état quasi-parfait.
            L&apos;encapsulation protège la carte et certifie son authenticité de façon permanente.
          </p>
        </div>
      </section>
    </main>
  )
}
