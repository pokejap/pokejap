'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Lock, Loader2, User, MapPin, Phone, Mail, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { useAuthStore } from '@/lib/auth-store'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CustomerInfo {
  prenom: string
  nom: string
  email: string
  telephone: string
  adresse: string
  complement: string
  codePostal: string
  ville: string
  pays: string
}

const INITIAL: CustomerInfo = {
  prenom: '', nom: '', email: '', telephone: '',
  adresse: '', complement: '', codePostal: '', ville: '', pays: 'France',
}

function Field({
  label, name, value, onChange, type = 'text', required = false, placeholder = '',
}: {
  label: string; name: keyof CustomerInfo; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-gray-400 text-xs font-medium mb-1">
        {label} {required && <span className="text-pokemon-red">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={name}
        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-pokemon-red transition-colors"
      />
    </div>
  )
}

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore()
  const { user } = useAuthStore()
  const [info, setInfo] = useState<CustomerInfo>(() =>
    user
      ? { prenom: user.prenom, nom: user.nom, email: user.email, telephone: user.telephone,
          adresse: user.adresse, complement: user.complement, codePostal: user.codePostal,
          ville: user.ville, pays: user.pays || 'France' }
      : INITIAL
  )
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')

  const subtotal = getTotalPrice()
  const shipping = 5.99
  const total = subtotal + shipping

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setInfo(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof CustomerInfo]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function validate(): boolean {
    const required: (keyof CustomerInfo)[] = ['prenom', 'nom', 'email', 'adresse', 'codePostal', 'ville']
    const newErrors: Partial<CustomerInfo> = {}
    for (const field of required) {
      if (!info[field].trim()) newErrors[field] = 'Champ obligatoire'
    }
    if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
      newErrors.email = 'Email invalide'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError(null)
    try {
      // On n'envoie que les IDs + quantités — le serveur relit les prix depuis products.ts
      const safeItems = items.map(i => ({ productId: i.product.id, quantity: i.quantity }))
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: safeItems, customer: info, couponCode: couponCode.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Une erreur est survenue')
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe non disponible')
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
      if (stripeError) throw new Error(stripeError.message)
    } catch (err: any) {
      setApiError(err.message)
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-400 mb-6">Votre panier est vide.</p>
        <Link href="/boutique" className="text-pokemon-red hover:underline">Retour à la boutique</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
      <Link href="/panier" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-sm transition-colors">
        <ArrowLeft size={16} /> Retour au panier
      </Link>
      <h1 className="text-4xl font-black text-white mb-8">
        <span className="text-pokemon-red">Finaliser</span> la commande
      </h1>

      <form onSubmit={handleCheckout}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Formulaire ────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Identité */}
            <div className="bg-pokemon-card rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-2 mb-5">
                <User size={18} className="text-pokemon-red" />
                <h2 className="text-white font-bold">Vos informations</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field label="Prénom" name="prenom" value={info.prenom} onChange={handleChange} required placeholder="Jean" />
                  {errors.prenom && <p className="text-red-400 text-xs mt-1">{errors.prenom}</p>}
                </div>
                <div>
                  <Field label="Nom" name="nom" value={info.nom} onChange={handleChange} required placeholder="Dupont" />
                  {errors.nom && <p className="text-red-400 text-xs mt-1">{errors.nom}</p>}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Field label="Email" name="email" value={info.email} onChange={handleChange} type="email" required placeholder="jean@exemple.com" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Field label="Téléphone" name="telephone" value={info.telephone} onChange={handleChange} type="tel" placeholder="+33 6 12 34 56 78" />
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="bg-pokemon-card rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={18} className="text-pokemon-red" />
                <h2 className="text-white font-bold">Adresse de livraison</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Field label="Adresse" name="adresse" value={info.adresse} onChange={handleChange} required placeholder="12 rue des Pokémons" />
                  {errors.adresse && <p className="text-red-400 text-xs mt-1">{errors.adresse}</p>}
                </div>
                <Field label="Complément d'adresse" name="complement" value={info.complement} onChange={handleChange} placeholder="Bât. A, Apt. 3..." />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Field label="Code postal" name="codePostal" value={info.codePostal} onChange={handleChange} required placeholder="75001" />
                    {errors.codePostal && <p className="text-red-400 text-xs mt-1">{errors.codePostal}</p>}
                  </div>
                  <div>
                    <Field label="Ville" name="ville" value={info.ville} onChange={handleChange} required placeholder="Paris" />
                    {errors.ville && <p className="text-red-400 text-xs mt-1">{errors.ville}</p>}
                  </div>
                </div>
                <Field label="Pays" name="pays" value={info.pays} onChange={handleChange} placeholder="France" />
              </div>
            </div>
          </div>

          {/* ── Récap commande + paiement ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Résumé */}
            <div className="bg-pokemon-card rounded-xl p-6 border border-white/5">
              <h2 className="text-white font-bold mb-4">Votre commande</h2>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-10 h-14 flex-shrink-0 bg-black/20 rounded overflow-hidden">
                      <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{item.product.name}</p>
                      <p className="text-gray-500 text-xs">{item.product.set}</p>
                      {item.quantity > 1 && <p className="text-gray-500 text-xs">× {item.quantity}</p>}
                    </div>
                    <p className="text-pokemon-yellow font-bold text-sm shrink-0">
                      {(item.product.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sous-total</span>
                  <span className="text-white">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Livraison Mondial Relay</span>
                  <span className="text-white">{shipping.toFixed(2)} €</span>
                </div>
                <p className="text-gray-600 text-xs">Livraison en point relais 3–5 jours ouvrés</p>
                <div className="flex justify-between font-bold pt-2 border-t border-white/10">
                  <span className="text-white">Total</span>
                  <span className="text-pokemon-yellow text-xl">{total.toFixed(2)} €</span>
                </div>
              </div>

              {/* Code promo */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-gray-400 text-xs font-medium mb-2">Code de réduction</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Ex: BIENVENUE10"
                    className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-600 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-pokemon-red transition-colors"
                  />
                </div>
                <p className="text-gray-600 text-xs mt-1">Le code sera appliqué sur la page de paiement</p>
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-pokemon-card rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={16} className="text-green-400" />
                <div>
                  <p className="text-white font-semibold text-sm">Paiement 100% sécurisé</p>
                  <p className="text-gray-500 text-xs">Chiffrement SSL · Powered by Stripe</p>
                </div>
              </div>

              {apiError && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-400 text-sm p-3 rounded-lg mb-4">
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-pokemon-yellow hover:bg-yellow-400 disabled:bg-yellow-900 text-pokemon-darker disabled:text-gray-500 font-black text-lg py-4 rounded-xl transition-all hover:scale-[1.02] disabled:scale-100"
              >
                {loading
                  ? <><Loader2 size={20} className="animate-spin" /> Redirection...</>
                  : <>Payer {total.toFixed(2)} € <ChevronRight size={20} /></>
                }
              </button>

              <p className="text-gray-600 text-xs text-center mt-3">
                Vous serez redirigé vers Stripe pour finaliser le paiement
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
