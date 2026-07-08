'use client'
import { useState } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'

export interface RelayPoint {
  id: number
  lat: number
  lon: number
  name: string
  address: string
  city: string
}

export default function RelayPicker({
  codePostal,
  selected,
  onSelect,
}: {
  codePostal: string
  ville: string
  selected: RelayPoint | null
  onSelect: (relay: RelayPoint | null) => void
}) {
  const [name,    setName]    = useState(selected?.name    ?? '')
  const [address, setAddress] = useState(selected?.address ?? '')

  function handleConfirm() {
    if (!name.trim() && !address.trim()) { onSelect(null); return }
    onSelect({ id: 0, lat: 0, lon: 0, name: name.trim(), address: address.trim(), city: '' })
  }

  const mrUrl = `https://www.mondialrelay.fr/trouver-le-point-relais-le-plus-proche-de-chez-moi/${
    codePostal ? `?zipCode=${encodeURIComponent(codePostal)}` : ''
  }`

  return (
    <div className="mt-3 space-y-3">

      {/* Bouton vers le site officiel */}
      <a
        href={mrUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 rounded-xl px-4 py-3 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <MapPin size={15} className="text-blue-400 shrink-0" />
          <div>
            <p className="text-white/80 text-xs font-semibold">Trouver un point relais près de chez moi</p>
            <p className="text-white/35 text-[11px]">Ouvre le site officiel Mondial Relay dans un nouvel onglet</p>
          </div>
        </div>
        <ExternalLink size={13} className="text-white/30 group-hover:text-white/60 shrink-0 transition-colors" />
      </a>

      {/* Champs pour coller les infos */}
      <div className="space-y-2">
        <p className="text-white/40 text-[11px]">Copiez le nom et l'adresse du point relais choisi :</p>
        <input
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); handleConfirmDebounced(e.target.value, address) }}
          placeholder="Nom du point relais (ex: Tabac du Centre)"
          className="w-full bg-white/[0.04] border border-white/10 text-white placeholder-white/20 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-white/30 transition-all"
        />
        <input
          type="text"
          value={address}
          onChange={e => { setAddress(e.target.value); handleConfirmDebounced(name, e.target.value) }}
          placeholder="Adresse (ex: 12 rue de la Paix, 75001 Paris)"
          className="w-full bg-white/[0.04] border border-white/10 text-white placeholder-white/20 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-white/30 transition-all"
        />
      </div>

      {/* Point confirmé */}
      {selected && (name || address) && (
        <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/25 rounded-xl px-3 py-2.5">
          <MapPin size={13} className="text-green-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {name    && <p className="text-green-400 text-xs font-semibold">{name}</p>}
            {address && <p className="text-white/40 text-[11px]">{address}</p>}
          </div>
        </div>
      )}
    </div>
  )

  function handleConfirmDebounced(n: string, a: string) {
    if (!n.trim() && !a.trim()) { onSelect(null); return }
    onSelect({ id: 0, lat: 0, lon: 0, name: n.trim(), address: a.trim(), city: '' })
  }
}
