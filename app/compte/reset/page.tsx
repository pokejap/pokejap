'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'

function ResetForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token') ?? ''
  const email = params.get('email') ?? ''

  const [valid, setValid]     = useState<boolean | null>(null) // null = chargement
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [show, setShow]         = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  useEffect(() => {
    if (!token || !email) { setValid(false); return }
    try {
      const stored: { token: string; email: string; expiry: number }[] =
        JSON.parse(localStorage.getItem('pokejap-reset-tokens') || '[]')
      const entry = stored.find(e => e.token === token && e.email.toLowerCase() === email.toLowerCase())
      if (!entry) { setValid(false); return }
      if (Date.now() > entry.expiry) {
        // expiré → nettoyer
        localStorage.setItem('pokejap-reset-tokens', JSON.stringify(stored.filter(e => e.token !== token)))
        setValid(false)
        return
      }
      setValid(true)
    } catch { setValid(false) }
  }, [token, email])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Minimum 6 caractères'); return }
    if (password !== confirm)  { setError('Les mots de passe ne correspondent pas'); return }

    try {
      // Mettre à jour le mot de passe dans pokejap-users
      const users: { email: string; password: string }[] =
        JSON.parse(localStorage.getItem('pokejap-users') || '[]')
      const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase())
      if (idx === -1) { setError('Compte introuvable'); return }
      users[idx].password = password
      localStorage.setItem('pokejap-users', JSON.stringify(users))

      // Supprimer le token utilisé
      const tokens: { token: string }[] =
        JSON.parse(localStorage.getItem('pokejap-reset-tokens') || '[]')
      localStorage.setItem('pokejap-reset-tokens', JSON.stringify(tokens.filter(t => t.token !== token)))

      setDone(true)
      setTimeout(() => router.push('/compte'), 2500)
    } catch { setError('Une erreur est survenue') }
  }

  if (valid === null) {
    return <p className="text-white/40 text-sm text-center py-8">Vérification du lien…</p>
  }

  if (!valid) {
    return (
      <div className="text-center py-8">
        <XCircle size={40} className="text-red-400 mx-auto mb-3" />
        <p className="text-white font-bold text-lg mb-1">Lien invalide ou expiré</p>
        <p className="text-white/40 text-sm mb-6">Ce lien de réinitialisation n'est plus valable.</p>
        <button onClick={() => router.push('/compte')}
          className="bg-pokemon-red text-white font-bold px-6 py-2.5 rounded-xl text-sm">
          Retour à la connexion
        </button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
        <p className="text-white font-bold text-lg mb-1">Mot de passe mis à jour !</p>
        <p className="text-white/40 text-sm">Redirection en cours…</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-gray-400 text-xs font-medium mb-1">
          Nouveau mot de passe <span className="text-pokemon-red">*</span>
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min. 6 caractères"
            required
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-pokemon-red transition-colors pr-10"
          />
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-gray-400 text-xs font-medium mb-1">
          Confirmer le mot de passe <span className="text-pokemon-red">*</span>
        </label>
        <input
          type={show ? 'text' : 'password'}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-pokemon-red transition-colors"
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}
      <button type="submit"
        className="w-full bg-pokemon-red hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.01]">
        Enregistrer le nouveau mot de passe
      </button>
    </form>
  )
}

export default function ResetPage() {
  return (
    <div className="max-w-md mx-auto px-4 pt-28 pb-16">
      <div className="mb-8">
        <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-1">Compte</p>
        <h1 className="text-3xl font-black text-white">Nouveau <span className="text-pokemon-red">mot de passe</span></h1>
      </div>
      <div className="bg-pokemon-card rounded-2xl border border-white/5 p-6">
        <Suspense fallback={<p className="text-white/40 text-sm text-center py-8">Chargement…</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  )
}
