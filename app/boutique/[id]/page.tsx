'use client'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, Shield, Package, Zap, Check } from 'lucide-react'
import { useState } from 'react'
import { getProductById } from '@/data/products'
import { useCartStore } from '@/lib/cart-store'

const rarityColors: Record<string, string> = {
  "Commune":     "bg-gray-600",
  "Peu Commune": "bg-blue-600",
  "Rare":        "bg-amber-600",
  "Rare Holo":   "bg-purple-600",
  "Ultra Rare":  "bg-rose-600",
  "Super Rare":  "bg-pink-600",
  "Secret Rare": "bg-yellow-500",
  "V":           "bg-blue-700",
  "VMAX":        "bg-indigo-700",
  "ex":          "bg-teal-600",
  "GX":          "bg-violet-700",
  "AR":          "bg-violet-700",
  "CHR":         "bg-fuchsia-700",
  "SAR":         "bg-rose-700",
  "UR":          "bg-amber-700",
}

const conditionDesc: Record<string, string> = {
  "Neuf": "Carte jamais jouee, en parfait etat.",
  "Quasi-Neuf": "Legeres traces d'usure a la loupe uniquement.",
  "Excellent": "Tres bon etat, legeres marques sur les bords.",
  "Bon": "Quelques traces d'usure visibles, jouable.",
  "Moyen": "Usure visible mais carte complete et lisible.",
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const product = getProductById(params.id as string)
  const [added, setAdded] = useState(false)
  const { addItem, openCart } = useCartStore()

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg mb-6">Carte introuvable.</p>
        <Link href="/boutique" className="text-pokemon-red hover:underline">Retour a la boutique</Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-10">
      <button onClick={() => router.push('/boutique')} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-sm cursor-pointer">
        <ArrowLeft size={16} /> Retour à la boutique
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex justify-center">
          <div className="relative w-72 h-96 md:w-80 md:h-[450px] drop-shadow-2xl hover:scale-105 transition-transform duration-500">
            <Image src={product.imageUrl} alt={product.name} fill className="object-contain" priority />
          </div>
        </div>
        <div>
          <div className="flex items-start gap-3 mb-4">
            <h1 className="text-4xl font-black text-white flex-1">{product.name}</h1>
            <span className={`text-sm px-3 py-1 rounded-full font-medium text-white mt-1 flex-shrink-0 ${rarityColors[product.rarity] || "bg-gray-600"}`}>{product.rarity}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "Extension", value: product.set },
              { label: "Numero", value: product.number },
              { label: "Type", value: product.type || "N/A" },
              { label: "PV", value: product.hp ? `${product.hp} PV` : "N/A" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-pokemon-card rounded-lg p-3 border border-white/5">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                <p className="text-white font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
          <div className="bg-pokemon-card rounded-xl p-4 border border-white/5 mb-6">
            <p className="text-gray-400 text-xs mb-1">Etat de la carte</p>
            <p className="text-white font-bold mb-1">{product.condition}</p>
            <p className="text-gray-400 text-sm">{conditionDesc[product.condition]}</p>
          </div>
          {product.description && <p className="text-gray-400 text-sm mb-6 leading-relaxed">{product.description}</p>}
          <div className="flex items-center justify-between mb-6">
            <span className="text-4xl font-black text-pokemon-yellow">{product.price.toFixed(2)} €</span>
            <span className={`text-sm font-medium ${product.stock > 3 ? "text-green-400" : product.stock > 0 ? "text-orange-400" : "text-red-400"}`}>
              {product.stock === 0 ? "Epuise" : product.stock <= 2 ? `Plus que ${product.stock} en stock !` : `${product.stock} en stock`}
            </span>
          </div>
          <button onClick={handleAddToCart} disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${added ? "bg-green-600 text-white" : product.stock === 0 ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-pokemon-red hover:bg-pokemon-darkred text-white hover:scale-[1.02] shadow-lg shadow-red-500/20"}`}>
            {added ? <><Check size={20} /> Ajoute au panier !</> : <><ShoppingCart size={20} /> Ajouter au panier</>}
          </button>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[{ icon: Shield, text: "Authentique" }, { icon: Package, text: "Emballage soigne" }, { icon: Zap, text: "Paiement securise" }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1 text-center">
                <Icon size={18} className="text-gray-500" />
                <span className="text-gray-500 text-xs">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
