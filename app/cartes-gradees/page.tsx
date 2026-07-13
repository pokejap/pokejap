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
    id: 'psa-mega-gengar-ex-m2a-230',
    name: 'Mega Gengar ex',
    numero: '#230',
    set: 'MEGA Dream ex (M2A)',
    setCode: 'M2A',
    grade: 9,
    price: 34.90,
    rarity: 'SAR',
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/427/Mega-Gengar-ex.M2A.230.60098.png',
    description: 'Mega Gengar ex Super Art Rare du set MEGA Dream ex',
  },
  {
    id: 'psa-vaporeon-v-s6a-075',
    name: 'Vaporeon V',
    numero: '#075',
    set: 'Eevee Heroes',
    setCode: 'S6A',
    grade: 9,
    price: 34.90,
    rarity: 'Full Art',
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/322/Vaporeon-V.S6A.75.38951.png',
    description: 'Vaporeon V Full Art issu du set Eevee Heroes',
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
    id: 'psa-xerneas-ex-25th-023',
    name: 'Xerneas EX Full Art 25th',
    numero: '#023/028',
    set: '25th Anniversary Collection',
    setCode: 'S8A',
    grade: 9,
    price: 54.90,
    rarity: 'Full Art',
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/299/Xerneas-EX.S8A.023.39731.png',
    description: 'Xerneas EX Full Art commémoratif 25ème anniversaire',
  },
  {
    id: 'psa-kangaskhan-ar-sv10-110',
    name: 'Kangaskhan AR',
    numero: '#110/196',
    set: 'Gloire de la Team Rocket (SV10)',
    setCode: 'SV10',
    grade: 9,
    price: 32.90,
    rarity: 'AR',
    langue: 'JPN',
    image: 'https://den-cards.pokellector.com/416/Kangaskhan.SV10.110.59000.png',
    description: 'Kangaskhan en illustration Alternative Rare SV10',
  },
]

const RARITY_COLORS: Record<string, string> = {
  'SAR': 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
  'AR':  'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  'Full Art': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
  'GX':  'bg-pink-500/20 text-pink-300 border border-pink-500/40',
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
    <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/25 transition-all duration-300">
      {/* PSA badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-yellow-400 text-black text-xs font-black px-2 py-1 rounded-md shadow-lg">
        <span>PSA</span>
        <span className="text-base leading-none">{card.grade}</span>
      </div>

      {/* Image */}
      <div className="relative aspect-[63/88] w-full bg-black/40 overflow-hidden">
        {!imgError ? (
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/30 gap-2 p-4 text-center">
            <span className="text-4xl">🃏</span>
            <span className="text-xs">{card.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      </div>

      {/* Infos */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-sm leading-tight">{card.name}</h3>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${RARITY_COLORS[card.rarity] ?? 'bg-white/10 text-white/60'}`}>
            {card.rarity}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 text-xs text-white/50">
          <span>{card.set}</span>
          <span>{card.numero} · 🇯🇵 JAP</span>
        </div>

        {/* Certification */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-yellow-400/80 bg-yellow-400/5 border border-yellow-400/20 rounded-lg px-2.5 py-1.5">
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
          <span>Certifiée PSA {card.grade} • Authentique</span>
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
