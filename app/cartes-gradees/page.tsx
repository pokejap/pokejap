'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────
// Données des cartes — modifie les prix ici
// ─────────────────────────────────────────────
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
    description: 'Mega Dragonite ex Super Art Rare du set MEGA Dream ex',
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
    description: 'Mega Froslass ex Super Art Rare du set MEGA Dream ex',
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
    description: 'Flygon en illustration Alternative Rare du set Inferno X',
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
    description: 'Pikachu Full Art commémoratif 25ème anniversaire',
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
    description: 'Mega Gengar ex Holo du MEGA Starter Set Mega Gengar ex',
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
    description: 'Vaporeon GX issu du set Eevee GX Starter Set — Sun & Moon 2018',
  },
  {
    id: 'psa-cynthia-spiritomb-ar-m2a-208',
    name: "Spiritomb de Cynthia AR",
    numero: '#208',
    set: 'MEGA Dream ex (M2A)',
    setCode: 'M2A',
    grade: 9,
    price: 32.90,
    rarity: 'AR',
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/427/Cynthias-Spiritomb.M2A.208.60082.png',
    description: 'Spiritomb de Cynthia en illustration Alternative Rare',
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
    description: 'Xerneas EX Full Art commémoratif 25ème anniversaire — Promo Pack S8AP',
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
    description: 'Kangaskhan en illustration Alternative Rare du set Glory of Team Rocket',
  },
]

const RARITY_COLORS: Record<string, string> = {
  'SAR': 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
  'AR':  'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  'Full Art': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
  'GX':  'bg-pink-500/20 text-pink-300 border border-pink-500/40',
  'Holo': 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
  'ex':  'bg-red-500/20 text-red-300 border border-red-500/40',
}

interface PSACard {
  id: string
  name: string
  numero: string
  set: string
  setCode: string
  grade: number
  price: number
  rarity: string
  langue: string
  image: string
  description: string
}

function PSACardItem({ card }: { card: PSACard }) {
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleAdd = () => {
    try {
      const stored = localStorage.getItem('pokejap-cart')
      const cart = stored ? JSON.parse(stored) : []
      const exists = cart.find((i: { id: string }) => i.id === card.id)
      if (!exists) {
        cart.push({
          id: card.id,
          name: card.name,
          price: card.price,
          image: card.image,
          quantity: 1,
          set: card.set,
          rarity: card.rarity,
          grade: `PSA ${card.grade}`,
        })
        localStorage.setItem('pokejap-cart', JSON.stringify(cart))
      }
    } catch {}
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/25 transition-all duration-300">

      {/* ── Dalle PSA ── */}
      <div className="relative p-2.5 pb-0 bg-gradient-to-b from-[#d0d3d8] via-[#b8bcc4] to-[#9ea3ad]">
        {/* Boîtier plastique — fenêtre carte */}
        <div
          className="relative overflow-hidden rounded-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(200,210,220,0.08) 100%)',
            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.5), inset 0 -1px 3px rgba(0,0,0,0.25)',
          }}
        >
          {/* Carte */}
          <div className="relative aspect-[63/88] w-full bg-[#1a1a2e] transition-transform duration-500 group-hover:scale-[1.02]">
            {card.image && !imgError ? (
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/30 gap-2 p-4 text-center">
                <span className="text-4xl">🃏</span>
                <span className="text-xs">{card.name}</span>
              </div>
            )}
            {/* Reflet plastique */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(120deg, rgba(255,255,255,0.12) 0%, transparent 45%, rgba(255,255,255,0.05) 100%)',
              }}
            />
          </div>
        </div>

        {/* Étiquette PSA jaune */}
        <div className="mt-2 bg-[#f5c400] px-2 py-1 flex items-center justify-between gap-1">
          {/* Gauche : logo PSA + set */}
          <div className="flex flex-col leading-none">
            <span className="font-black text-black text-[10px] tracking-widest">PSA</span>
            <span className="text-[7px] text-black/70 font-semibold truncate max-w-[90px]">{card.setCode} · {card.numero}</span>
          </div>
          {/* Droite : note */}
          <div className="flex flex-col items-end leading-none">
            <span className="text-[7px] text-black/60 font-semibold uppercase">MINT</span>
            <span className="text-xl font-black text-black leading-none">{card.grade}</span>
          </div>
        </div>

        {/* Bande noire bas de dalle */}
        <div className="h-2 bg-[#1a1a1a] rounded-b-sm" />
      </div>

      {/* ── Infos sous la dalle ── */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-sm leading-tight">{card.name}</h3>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${RARITY_COLORS[card.rarity] ?? 'bg-white/10 text-white/60'}`}>
            {card.rarity}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 text-xs text-white/50">
          <span>{card.set}</span>
          <span>🇯🇵 Japonaise</span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-white font-bold text-lg">{card.price.toFixed(2)}€</span>
          <button
            onClick={handleAdd}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-white text-black hover:bg-white/90 active:scale-95'
            }`}
          >
            {added ? '✓ Ajouté' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CartesGradeesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-16 px-6 text-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black text-xs font-black px-3 py-1.5 rounded-full mb-4 shadow-lg">
            <span>PSA CERTIFIED</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {PSA_CARDS.map((card) => (
            <PSACardItem key={card.id} card={card} />
          ))}
        </div>
      </section>

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
