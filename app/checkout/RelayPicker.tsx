'use client'
import { useState, useEffect } from 'react'
import { MapPin, ExternalLink, CheckCircle2 } from 'lucide-react'

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
  onSelect: (r: RelayPoint | null) => void
}) {
  const [numero, setNumero] = useState('')
  const [nom, setNom]       = useState('')

  // Réinitialiser si le CP change
  useEffect(() => {
    setNumero('')
    setNom('')
    onSelect(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codePostal])

  function handleChange(n: string, nm: string) {
    const num = n.trim()
    const name = nm.trim()
    if (num && name) {
      onSelect({ id: parseInt(num) || 0, lat: 0, lon: 0, name, address: '', city: '' })
    } else {
      onSelect(null)
    }
  }

  const mrUrl = codePostal
    ? `https://www.mondialrelay.fr/trouver-le-point-relais-le-plus-proche/?cp=${codePostal}`
    : 'https://www.mondialrelay.fr/trouver-le-point-relais-le-plus-proche/'

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-white/10 bg-black/20">

      {/* Header */}
      <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2">
        <MapPin size={13} className="text-red-400 shrink-0" />
        <span className="text-white/70 text-xs font-semibold">Choisissez votre point relais</span>
      </div>

      <div className="px-3 py-3 space-y-3">

        {/* Lien Mondial Relay */}
        <a
          href={mrUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 w-full bg-pokemon-red/10 hover:bg-pokemon-red/20 border border-pokemon-red/30 text-pokemon-red text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors"
        >
          <span>Trouver un point relais près de chez moi</span>
          <ExternalLink size={12} className="shrink-0" />
        </a>

        <p className="text-white/30 text-[11px] text-center">
          Notez le numéro et le nom du point relais, puis renseignez-les ci-dessous.
        </p>

        {/* Champs de saisie */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Numéro du point relais (ex: 123456)"
            value={numero}
            onChange={e => { setNumero(e.target.value); handleChange(e.target.value, nom) }}
            className="w-full bg-white/[0.04] border border-white/10 text-white placeholder-white/20 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-white/40 transition-colors"
          />
          <input
            type="text"
            placeholder="Nom du point relais (ex: TABAC DU CENTRE)"
            value={nom}
            onChange={e => { setNom(e.target.value); handleChange(numero, e.target.value) }}
            className="w-full bg-white/[0.04] border border-white/10 text-white placeholder-white/20 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-white/40 transition-colors"
          />
        </div>

        {/* Confirmation */}
        {selected && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            <CheckCircle2 size={12} className="text-green-400 shrink-0" />
            <p className="text-green-400 text-xs font-semibold truncate">
              Point relais #{selected.id} — {selected.name}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
