'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  id: string
  email: string
  prenom: string
  nom: string
  telephone: string
  adresse: string
  complement: string
  codePostal: string
  ville: string
  pays: string
}

interface StoredUser extends UserProfile {
  password: string // stocké localement — convient pour une boutique perso
}

interface AuthStore {
  user: UserProfile | null
  register: (data: Omit<StoredUser, 'id'>) => { success: boolean; error?: string }
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
}

// Les utilisateurs sont stockés dans une clé séparée du localStorage
function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem('pokejap-users') || '[]') } catch { return [] }
}
function saveUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('pokejap-users', JSON.stringify(users))
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      register: (data) => {
        const users = getUsers()
        if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
          return { success: false, error: 'Un compte existe déjà avec cet email.' }
        }
        const newUser: StoredUser = { ...data, id: crypto.randomUUID(), email: data.email.toLowerCase() }
        saveUsers([...users, newUser])
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pw, ...profile } = newUser
        set({ user: profile })
        // Notification email
        fetch('/api/notify-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prenom: data.prenom, nom: data.nom, email: data.email }),
        }).catch(() => {}) // silencieux si erreur
        return { success: true }
      },

      login: (email, password) => {
        const users = getUsers()
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
        if (!found) return { success: false, error: 'Email ou mot de passe incorrect.' }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pw, ...profile } = found
        set({ user: profile })
        return { success: true }
      },

      logout: () => set({ user: null }),

      updateProfile: (data) =>
        set((state) => {
          if (!state.user) return state
          const updated = { ...state.user, ...data }
          // Mettre à jour aussi dans le tableau des users
          const users = getUsers()
          const idx = users.findIndex(u => u.id === state.user!.id)
          if (idx !== -1) {
            users[idx] = { ...users[idx], ...data }
            saveUsers(users)
          }
          return { user: updated }
        }),
    }),
    { name: 'pokejap-auth' }
  )
)
