'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Lock, Loader2, ChevronDown, Shield, RotateCcw, Package } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { useAuthStore } from '@/lib/auth-store'
import { loadStripe } from '@stripe/stripe-js'
import dynamic from 'next/dynamic'
import type { RelayPoint } from './RelayPicker'

const RelayPicker = dynamic(() => import('./RelayPicker'), { ssr: false })

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// 'europe' = pays européens hors France, 'world' = reste du monde
const PAYS_OPTIONS: { value: string; label: string; zone: 'france' | 'europe' | 'world' }[] = [
  { value: 'France',             label: '🇫🇷 France',             zone: 'france'  },
  { value: 'Belgique',           label: '🇧🇪 Belgique',           zone: 'europe'  },
  { value: 'Luxembourg',         label: '🇱🇺 Luxembourg',         zone: 'europe'  },
  { value: 'Suisse',             label: '🇨🇭 Suisse',             zone: 'europe'  },
  { value: 'Monaco',             label: '🇲🇨 Monaco',             zone: 'europe'  },
  { value: 'Allemagne',          label: '🇩🇪 Allemagne',          zone: 'europe'  },
  { value: 'Espagne',            label: '🇪🇸 Espagne',            zone: 'europe'  },
  { value: 'Italie',             label: '🇮🇹 Italie',             zone: 'europe'  },
  { value: 'Pays-Bas',           label: '🇳🇱 Pays-Bas',           zone: 'europe'  },
  { value: 'Portugal',           label: '🇵🇹 Portugal',           zone: 'europe'  },
  { value: 'Autriche',           label: '🇦🇹 Autriche',           zone: 'europe'  },
  { value: 'Suède',              label: '🇸🇪 Suède',              zone: 'europe'  },
  { value: 'Danemark',           label: '🇩🇰 Danemark',           zone: 'europe'  },
  { value: 'Finlande',           label: '🇫🇮 Finlande',           zone: 'europe'  },
  { value: 'Norvège',            label: '🇳🇴 Norvège',            zone: 'europe'  },
  { value: 'Pologne',            label: '🇵🇱 Pologne',            zone: 'europe'  },
  { value: 'République Tchèque', label: '🇨🇿 République Tchèque', zone: 'europe'  },
  { value: 'Hongrie',            label: '🇭🇺 Hongrie',            zone: 'europe'  },
  { value: 'Roumanie',           label: '🇷🇴 Roumanie',           zone: 'europe'  },
  { value: 'Grèce',              label: '🇬🇷 Grèce',              zone: 'europe'  },
  { value: 'Irlande',            label: '🇮🇪 Irlande',            zone: 'europe'  },
  { value: 'Royaume-Uni',        label: '🇬🇧 Royaume-Uni',        zone: 'europe'  },
  { value: 'États-Unis',         label: '🇺🇸 États-Unis',         zone: 'world'   },
  { value: 'Canada',             label: '🇨🇦 Canada',             zone: 'world'   },
  { value: 'Australie',          label: '🇦🇺 Australie',          zone: 'world'   },
  { value: 'Japon',              label: '🇯🇵 Japon',              zone: 'world'   },
  { value: 'Autre',              label: '🌍 Autre pays',           zone: 'world'   },
]

function getZone(pays: string): 'france' | 'europe' | 'world' {
  return PAYS_OPTIONS.find(p => p.value === pays)?.zone ?? 'world'
}

type ShippingMethod = 'relay' | 'home' | 'europe' | 'international'

const SHIPPING_OPTIONS: Record<ShippingMethod, { label: string; price: number; eta: string }> = {
  relay:         { label: 'Point Relais — Mondial Relay',      price: 4.99,  eta: 'France · 3–5 jours ouvrés'       },
  home:          { label: 'Livraison à domicile — Colissimo',  price: 7.99,  eta: 'France · 2–3 jours ouvrés'       },
  europe:        { label: 'Colissimo Europe',                  price: 12.99, eta: 'Europe · 5–8 jours ouvrés'       },
  international: { label: 'Livraison Mondiale',                price: 24.99, eta: 'Hors Europe · 7–14 jours ouvrés' },
}

interface CustomerInfo {
  prenom: string; nom: string; email: string; telephone: string
  adresse: string; complement: string; codePostal: string; ville: string; pays: string
}

const INITIAL: CustomerInfo = {
  prenom: '', nom: '', email: '', telephone: '',
  adresse: '', complement: '', codePostal: '', ville: '', pays: 'France',
}

const inputCls = (err?: string) =>
  `w-full bg-white/[0.04] border ${err ? 'border-red-500/70' : 'border-white/10'} text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-white/40 focus:bg-white/[0.07] transition-all`

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
  const [couponOpen, setCouponOpen] = useState(false)
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('relay')
  const [relayPoint, setRelayPoint] = useState<RelayPoint | null>(null)
  const [summaryOpen, setSummaryOpen] = useState(false)

  useEffect(() => {
    const zone = getZone(info.pays)
    if (zone === 'france') setShippingMethod(prev => (prev === 'europe' || prev === 'international') ? 'relay' : prev)
    else if (zone === 'europe') setShippingMethod('europe')
    else setShippingMethod('international')
  }, [info.pays])

  const FREE_SHIPPING_THRESHOLD = 50
  const subtotal = getTotalPrice()
  const isFrance = shippingMethod === 'relay' || shippingMethod === 'home'
  const shippingFree = isFrance && subtotal >= FREE_SHIPPING_THRESHOLD
  const shipping = shippingFree ? 0 : SHIPPING_OPTIONS[shippingMethod].price
  const total = subtotal + shipping

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setInfo(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof CustomerInfo]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate(): boolean {
    const required: (keyof CustomerInfo)[] = ['prenom', 'nom', 'email', 'adresse', 'codePostal', 'ville']
    const newErrors: Partial<CustomerInfo> = {}
    for (const field of required) {
      if (!info[field].trim()) newErrors[field] = 'Obligatoire'
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
      const safeItems = items.map(i => ({ productId: i.product.id, quantity: i.quantity }))
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: safeItems,
          customer: info,
          couponCode: couponCode.trim() || undefined,
          shippingMethod,
          relayPoint: shippingMethod === 'relay' ? relayPoint : undefined,
        }),
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <Package size={48} className="text-white/20" />
        <p className="text-white/60">Votre panier est vide.</p>
        <Link href="/boutique" className="text-pokemon-red hover:underline text-sm">Retour à la boutique</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080810]">

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="border-b border-white/[0.06] bg-[#080810]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/panier" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
            <ArrowLeft size={15} /> Retour
          </Link>
          <div className="flex items-center gap-2 text-white font-black text-lg">
            Poke<span className="text-pokemon-red">Jap</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/30 text-xs">
            <Lock size={12} className="text-green-400/70" />
            <span>Paiement sécurisé</span>
          </div>
        </div>
      </header>

      {/* ── Récap mobile (accordéon) ─────────────────────────────── */}
      <div className="lg:hidden border-b border-white/[0.06] bg-white/[0.02]">
        <button
          onClick={() => setSummaryOpen(!summaryOpen)}
          className="w-full flex items-center justify-between px-4 py-4"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Package size={16} className="text-pokemon-red" />
            <span>Voir ma commande ({items.length} article{items.length > 1 ? 's' : ''})</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-pokemon-yellow font-black">{total.toFixed(2)} €</span>
            <ChevronDown size={16} className={`text-white/40 transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
        {summaryOpen && (
          <div className="px-4 pb-4 space-y-3">
            {items.map(item => (
              <div key={item.product.id} className="flex gap-3">
                <div className="relative w-12 h-16 shrink-0 bg-white/5 rounded-lg overflow-hidden">
                  <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{item.product.name}</p>
                  <p className="text-white/40 text-xs">{item.product.set}</p>
                  {item.quantity > 1 && <p className="text-white/40 text-xs">× {item.quantity}</p>}
                </div>
                <p className="text-white text-sm font-bold">{(item.product.price * item.quantity).toFixed(2)} €</p>
              </div>
            ))}
            <div className="border-t border-white/10 pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Sous-total</span><span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Livraison</span>
                <span>{shippingFree ? <span className="text-green-400">Gratuite</span> : `${shipping.toFixed(2)} €`}</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-1">
                <span>Total</span><span className="text-pokemon-yellow">{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleCheckout}>
        <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">

          {/* ── Colonne gauche — Formulaire ───────────────────────── */}
          <div className="space-y-8 order-2 lg:order-1">

            {/* Section Contact */}
            <section>
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pokemon-red text-white text-xs flex items-center justify-center font-black">1</span>
                Contact
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input name="prenom" value={info.prenom} onChange={handleChange}
                      placeholder="Prénom *" autoComplete="given-name"
                      className={inputCls(errors.prenom)} />
                    {errors.prenom && <p className="text-red-400 text-xs mt-1">{errors.prenom}</p>}
                  </div>
                  <div>
                    <input name="nom" value={info.nom} onChange={handleChange}
                      placeholder="Nom *" autoComplete="family-name"
                      className={inputCls(errors.nom)} />
                    {errors.nom && <p className="text-red-400 text-xs mt-1">{errors.nom}</p>}
                  </div>
                </div>
                <div>
                  <input name="email" type="email" value={info.email} onChange={handleChange}
                    placeholder="Adresse e-mail *" autoComplete="email"
                    className={inputCls(errors.email)} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <input name="telephone" type="tel" value={info.telephone} onChange={handleChange}
                  placeholder="Téléphone (optionnel)" autoComplete="tel"
                  className={inputCls()} />
              </div>
            </section>

            {/* Section Adresse */}
            <section>
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pokemon-red text-white text-xs flex items-center justify-center font-black">2</span>
                Adresse de livraison
              </h2>
              <div className="space-y-3">
                {/* Sélecteur pays */}
                <div className="relative">
                  <select
                    name="pays"
                    value={info.pays}
                    onChange={e => setInfo(prev => ({ ...prev, pays: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 pr-10 rounded-xl text-sm focus:outline-none focus:border-white/40 focus:bg-white/[0.07] transition-all appearance-none cursor-pointer"
                  >
                    {PAYS_OPTIONS.map(p => (
                      <option key={p.value} value={p.value} className="bg-[#0A0A14]">{p.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <ChevronDown size={15} className="text-white/40" />
                  </div>
                </div>

                <div>
                  <input name="adresse" value={info.adresse} onChange={handleChange}
                    placeholder="Adresse *" autoComplete="street-address"
                    className={inputCls(errors.adresse)} />
                  {errors.adresse && <p className="text-red-400 text-xs mt-1">{errors.adresse}</p>}
                </div>
                <input name="complement" value={info.complement} onChange={handleChange}
                  placeholder="Complément d'adresse (optionnel)"
                  className={inputCls()} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input name="codePostal" value={info.codePostal} onChange={handleChange}
                      placeholder="Code postal *" autoComplete="postal-code"
                      className={inputCls(errors.codePostal)} />
                    {errors.codePostal && <p className="text-red-400 text-xs mt-1">{errors.codePostal}</p>}
                  </div>
                  <div>
                    <input name="ville" value={info.ville} onChange={handleChange}
                      placeholder="Ville *" autoComplete="address-level2"
                      className={inputCls(errors.ville)} />
                    {errors.ville && <p className="text-red-400 text-xs mt-1">{errors.ville}</p>}
                  </div>
                </div>
              </div>
            </section>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {apiError}
              </div>
            )}

            {/* Bouton mobile uniquement */}
            <div className="lg:hidden">
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-pokemon-yellow hover:bg-yellow-400 disabled:opacity-50 text-black font-black text-base py-4 rounded-xl transition-all">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Redirection...</> : <><Lock size={16} /> Payer {total.toFixed(2)} €</>}
              </button>
            </div>
          </div>

          {/* ── Colonne droite — Récap (sticky desktop) ──────────── */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-24 space-y-4">

              {/* Résumé commande */}
              <div className="hidden lg:block bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <h3 className="text-white font-bold text-sm mb-5">Ma commande</h3>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-12 h-16 shrink-0 bg-white/5 rounded-lg overflow-hidden">
                        <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain p-1" />
                        {item.quantity > 1 && (
                          <span className="absolute -top-1 -right-1 bg-pokemon-red text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">{item.quantity}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold leading-tight">{item.product.name}</p>
                        <p className="text-white/40 text-xs mt-0.5">{item.product.set}</p>
                      </div>
                      <p className="text-white text-sm font-bold shrink-0">{(item.product.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  ))}
                </div>

                {/* Livraison */}
                <div className="mt-5 pt-4 border-t border-white/[0.07]">
                  <p className="text-white/50 text-xs font-medium mb-3 uppercase tracking-wider">Livraison</p>

                  {shippingFree && (
                    <div className="mb-3 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5 text-green-400 text-xs font-medium">
                      🎉 Livraison offerte à partir de 50 € (France uniquement)
                    </div>
                  )}

                  <div className="space-y-2">
                    {(Object.entries(SHIPPING_OPTIONS) as [ShippingMethod, typeof SHIPPING_OPTIONS[ShippingMethod]][]).map(([key, opt]) => {
                      const zone = getZone(info.pays)
                      if (zone !== 'france' && (key === 'relay' || key === 'home')) return null
                      if (zone === 'france' && (key === 'europe' || key === 'international')) return null
                      if (zone === 'europe' && (key === 'relay' || key === 'home' || key === 'international')) return null
                      if (zone === 'world' && key !== 'international') return null
                      const isFreeOption = (key === 'relay' || key === 'home') && subtotal >= FREE_SHIPPING_THRESHOLD
                      const selected = shippingMethod === key
                      return (
                        <label key={key}
                          className={`flex items-center justify-between gap-3 px-3 py-3 rounded-xl border cursor-pointer transition-all ${
                            selected ? 'border-pokemon-red/60 bg-pokemon-red/5' : 'border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              selected ? 'border-pokemon-red' : 'border-white/25'
                            }`}>
                              {selected && <div className="w-1.5 h-1.5 rounded-full bg-pokemon-red" />}
                            </div>
                            <input type="radio" name="shippingMethod" value={key}
                              checked={selected} onChange={() => setShippingMethod(key)} className="sr-only" />
                            <div>
                              <p className="text-white text-xs font-semibold">{opt.label}</p>
                              <p className="text-white/35 text-[11px]">{opt.eta}</p>
                            </div>
                          </div>
                          {isFreeOption
                            ? <span className="text-green-400 text-xs font-bold shrink-0">Gratuite</span>
                            : <span className="text-white text-xs font-bold shrink-0">{opt.price.toFixed(2)} €</span>
                          }
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Carte point relais */}
                {shippingMethod === 'relay' && (
                  <RelayPicker
                    codePostal={info.codePostal}
                    ville={info.ville}
                    selected={relayPoint}
                    onSelect={setRelayPoint}
                  />
                )}

                {/* Code promo */}
                <div className="mt-5 pt-4 border-t border-white/[0.07]">
                  <button type="button" onClick={() => setCouponOpen(!couponOpen)}
                    className="flex items-center gap-2 text-white/50 hover:text-white/80 text-xs transition-colors w-full">
                    <ChevronDown size={13} className={`transition-transform ${couponOpen ? 'rotate-180' : ''}`} />
                    Ajouter un code de réduction
                  </button>
                  {couponOpen && (
                    <div className="mt-3">
                      <input
                        type="text" value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Code de réduction"
                        className="w-full bg-white/[0.04] border border-white/10 text-white placeholder-white/20 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/30 transition-all"
                      />
                      <p className="text-white/30 text-xs mt-1.5">Appliqué sur la page de paiement</p>
                    </div>
                  )}
                </div>

                {/* Totaux */}
                <div className="mt-4 pt-4 border-t border-white/[0.07] space-y-2 text-sm">
                  <div className="flex justify-between text-white/50">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Livraison</span>
                    {shippingFree
                      ? <span className="text-green-400 font-semibold">Gratuite</span>
                      : <span>{shipping.toFixed(2)} €</span>
                    }
                  </div>
                  <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/[0.07] mt-2">
                    <span>Total</span>
                    <span className="text-pokemon-yellow text-xl">{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Bouton payer desktop */}
              <div className="hidden lg:block">
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-pokemon-yellow hover:bg-yellow-400 disabled:opacity-50 text-black font-black text-lg py-4 rounded-xl transition-all hover:scale-[1.01]">
                  {loading
                    ? <><Loader2 size={20} className="animate-spin" /> Redirection...</>
                    : <><Lock size={17} /> Payer {total.toFixed(2)} €</>
                  }
                </button>
                <p className="text-white/25 text-xs text-center mt-3">
                  Vous serez redirigé vers Stripe pour finaliser le paiement
                </p>
              </div>

              {/* Badges confiance */}
              <div className="hidden lg:grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                  <Shield size={18} className="text-green-400 mx-auto mb-1.5" />
                  <p className="text-white/50 text-[10px] leading-tight">Paiement<br />sécurisé SSL</p>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                  <Lock size={18} className="text-blue-400 mx-auto mb-1.5" />
                  <p className="text-white/50 text-[10px] leading-tight">Données<br />protégées</p>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                  <RotateCcw size={18} className="text-pokemon-yellow mx-auto mb-1.5" />
                  <p className="text-white/50 text-[10px] leading-tight">Support<br />client réactif</p>
                </div>
              </div>

              {/* Logos cartes */}
              <div className="hidden lg:flex items-center justify-center gap-3 opacity-30">
                {['VISA', 'MC', 'CB', 'AMEX'].map(card => (
                  <div key={card} className="bg-white/10 text-white/60 text-[9px] font-black px-2 py-1 rounded tracking-widest">{card}</div>
                ))}
                <div className="text-white/40 text-[9px] font-medium">Powered by Stripe</div>
              </div>

            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
