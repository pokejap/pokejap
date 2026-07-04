'use client'
import { useState, useEffect } from 'react'
import { User, LogIn, UserPlus, LogOut, Edit3, Check, Eye, EyeOff, MapPin, Phone, Mail } from 'lucide-react'
import { useAuthStore, UserProfile } from '@/lib/auth-store'
import Link from 'next/link'

// ── Champ générique ──────────────────────────────────────────────────────────
function Field({
  label, name, value, onChange, type = 'text', required = false, placeholder = '',
  showToggle = false,
}: {
  label: string; name: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string; required?: boolean; placeholder?: string; showToggle?: boolean
}) {
  const [show, setShow] = useState(false)
  const inputType = showToggle ? (show ? 'text' : 'password') : type
  return (
    <div>
      <label className="block text-gray-400 text-xs font-medium mb-1">
        {label} {required && <span className="text-pokemon-red">*</span>}
      </label>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-pokemon-red transition-colors pr-10"
        />
        {showToggle && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Formulaire Connexion ──────────────────────────────────────────────────────
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = login(form.email, form.password)
    setLoading(false)
    if (res.success) onSuccess()
    else setError(res.error || 'Erreur')
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" name="email" value={form.email} onChange={handle} type="email" required placeholder="jean@exemple.com" />
      <Field label="Mot de passe" name="password" value={form.password} onChange={handle} required showToggle placeholder="••••••••" />
      {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full bg-pokemon-red hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-60">
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}

// ── Formulaire Inscription ────────────────────────────────────────────────────
function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { register } = useAuthStore()
  const [form, setForm] = useState({ prenom: '', email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.name]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.prenom.trim()) e.prenom = 'Obligatoire'
    if (!form.email.trim()) e.email = 'Obligatoire'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide'
    if (!form.password) e.password = 'Obligatoire'
    else if (form.password.length < 6) e.password = 'Minimum 6 caractères'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const res = register({
      email: form.email, prenom: form.prenom, nom: '',
      telephone: '', adresse: '', complement: '',
      codePostal: '', ville: '', pays: 'France',
      password: form.password,
    })
    setLoading(false)
    if (res.success) onSuccess()
    else setErrors({ email: res.error || 'Erreur' })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Field label="Prénom" name="prenom" value={form.prenom} onChange={handle} required placeholder="Jean" />
        {errors.prenom && <p className="text-red-400 text-xs mt-1">{errors.prenom}</p>}
      </div>
      <div>
        <Field label="Email" name="email" value={form.email} onChange={handle} type="email" required placeholder="jean@exemple.com" />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <Field label="Mot de passe" name="password" value={form.password} onChange={handle} required showToggle placeholder="Min. 6 caractères" />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-pokemon-red hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-60">
        {loading ? 'Création...' : 'Créer mon compte'}
      </button>
    </form>
  )
}

// ── Vue Profil connecté ───────────────────────────────────────────────────────
function ProfileView() {
  const { user, logout, updateProfile } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<UserProfile>(user!)
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (user) setForm(user) }, [user])

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  function save(e: React.FormEvent) {
    e.preventDefault()
    updateProfile(form)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header profil */}
      <div className="bg-pokemon-card rounded-2xl p-6 border border-white/5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-pokemon-red/20 border-2 border-pokemon-red/40 flex items-center justify-center shrink-0">
          <span className="text-pokemon-red font-black text-2xl">
            {user.prenom.charAt(0).toUpperCase()}{user.nom.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-black text-xl">{user.prenom} {user.nom}</h2>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(e => !e)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-2 rounded-lg transition-colors">
            <Edit3 size={13} /> Modifier
          </button>
          <button onClick={logout}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-700/60 px-3 py-2 rounded-lg transition-colors">
            <LogOut size={13} /> Déconnexion
          </button>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm">
          <Check size={16} /> Profil mis à jour avec succès
        </div>
      )}

      {editing ? (
        <form onSubmit={save} className="bg-pokemon-card rounded-2xl p-6 border border-white/5 space-y-5">
          <h3 className="text-white font-bold mb-2">Modifier mes informations</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom" name="prenom" value={form.prenom} onChange={handle} required />
            <Field label="Nom" name="nom" value={form.nom} onChange={handle} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Email" name="email" value={form.email} onChange={handle} type="email" required />
            <Field label="Téléphone" name="telephone" value={form.telephone} onChange={handle} type="tel" />
          </div>
          <div className="space-y-3">
            <Field label="Adresse" name="adresse" value={form.adresse} onChange={handle} />
            <Field label="Complément" name="complement" value={form.complement} onChange={handle} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Code postal" name="codePostal" value={form.codePostal} onChange={handle} />
              <Field label="Ville" name="ville" value={form.ville} onChange={handle} />
            </div>
            <Field label="Pays" name="pays" value={form.pays} onChange={handle} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-pokemon-red hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all">
              Sauvegarder
            </button>
            <button type="button" onClick={() => setEditing(false)}
              className="px-6 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-colors">
              Annuler
            </button>
          </div>
        </form>
      ) : (
        /* Infos en lecture seule */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Mail,  label: 'Email',     value: user.email         },
            { icon: Phone, label: 'Téléphone', value: user.telephone || '—' },
            { icon: MapPin, label: 'Adresse',  value: user.adresse ? `${user.adresse}${user.complement ? ', ' + user.complement : ''}, ${user.codePostal} ${user.ville}, ${user.pays}` : '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className={`bg-pokemon-card rounded-xl p-4 border border-white/5 ${label === 'Adresse' ? 'sm:col-span-2' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} className="text-pokemon-red" />
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
              <p className="text-white text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-pokemon-card rounded-xl p-4 border border-white/5 flex items-center justify-between">
        <p className="text-gray-400 text-sm">Vos infos seront pré-remplies à la prochaine commande</p>
        <Link href="/boutique" className="text-pokemon-red hover:text-red-400 text-sm font-semibold transition-colors">
          Boutique →
        </Link>
      </div>
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function ComptePage() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [success, setSuccess] = useState(false)

  // Hydratation Zustand
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">
      <div className="mb-8">
        <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-1" translate="no">アカウント</p>
        <h1 className="text-4xl font-black text-white">
          Mon <span className="text-pokemon-red">Compte</span>
        </h1>
      </div>

      {user ? (
        <ProfileView />
      ) : success ? (
        <div className="bg-pokemon-card rounded-2xl p-8 border border-white/5 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-green-400" />
          </div>
          <h2 className="text-white font-black text-xl mb-2">Compte créé !</h2>
          <p className="text-gray-400 text-sm mb-6">Bienvenue ! Voici votre code de réduction — utilisez-le sur votre première commande.</p>

          {/* Code promo révélé */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-red-900/10 border border-yellow-400/30 rounded-2xl px-6 py-5 mb-6">
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">🎁 Votre réduction de bienvenue</p>
            <p className="text-white font-black text-3xl tracking-widest mb-1">BIENVENUE10</p>
            <p className="text-gray-400 text-xs">−10% sur toute la boutique · Valable sur votre 1ère commande</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/scelles" className="inline-block bg-pokemon-red hover:bg-red-600 text-white font-bold px-8 py-3 rounded-xl transition-all">
              Voir les scellés →
            </Link>
            <Link href="/boutique" className="inline-block bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-xl transition-all">
              Singles japonais
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-pokemon-card rounded-2xl border border-white/5 overflow-hidden">
          {/* Onglets */}
          <div className="grid grid-cols-2 border-b border-white/10">
            {([
              { id: 'login',    icon: LogIn,    label: 'Se connecter' },
              { id: 'register', icon: UserPlus, label: 'Créer un compte' },
            ] as const).map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                  tab === id ? 'text-white border-b-2 border-pokemon-red bg-white/[0.03]' : 'text-gray-500 hover:text-gray-300'
                }`}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          {/* Contenu */}
          <div className="p-6">
            {tab === 'login'
              ? <LoginForm onSuccess={() => {}} />
              : <RegisterForm onSuccess={() => setSuccess(true)} />
            }
          </div>
        </div>
      )}
    </div>
  )
}
