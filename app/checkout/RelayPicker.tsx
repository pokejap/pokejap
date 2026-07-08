'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react'
import type { RelayPointData } from '../api/relay-points/route'

export interface RelayPoint {
  id: number
  lat: number
  lon: number
  name: string
  address: string
  city: string
}

// Convertit RelayPointData (API) → RelayPoint (état du checkout)
function toRelayPoint(r: RelayPointData): RelayPoint {
  return { id: parseInt(r.id) || 0, lat: r.lat, lon: r.lon, name: r.name, address: r.address, city: r.city }
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
  const [points,   setPoints]   = useState<RelayPointData[]>([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [hovered,  setHovered]  = useState<string | null>(null)
  const mapRef    = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<any>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const lastCp    = useRef('')

  // ── Chargement des points depuis l'API ───────────────────────────────────
  const fetchPoints = useCallback(async (cp: string) => {
    if (cp === lastCp.current) return
    lastCp.current = cp
    setLoading(true)
    setError('')
    setPoints([])
    onSelect(null)

    try {
      const res = await fetch(`/api/relay-points?cp=${encodeURIComponent(cp)}`)
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? 'Erreur API')
      if (!data.points?.length) throw new Error('Aucun point relais trouvé dans ce secteur')
      setPoints(data.points)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [onSelect])

  // Déclencher la recherche quand le code postal est complet
  useEffect(() => {
    if (/^\d{5}$/.test(codePostal)) fetchPoints(codePostal)
  }, [codePostal, fetchPoints])

  // ── Initialisation Leaflet ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return

    // Charger Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Charger Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      const L = (window as any).L
      const map = L.map(mapRef.current!, { zoomControl: true, attributionControl: false })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
      leafletRef.current = map
    }
    document.head.appendChild(script)
  }, [])

  // ── Mise à jour des marqueurs quand les points changent ───────────────────
  useEffect(() => {
    const L = (window as any).L
    if (!leafletRef.current || !L || !points.length) return

    const map = leafletRef.current

    // Supprimer anciens marqueurs
    markersRef.current.forEach(m => m.remove())
    markersRef.current.clear()

    const bounds: [number, number][] = []

    points.forEach(p => {
      const isSelected = selected?.id === parseInt(p.id)

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:28px;height:28px;border-radius:50% 50% 50% 0;
          background:${isSelected ? '#22c55e' : '#ef4444'};
          border:2px solid ${isSelected ? '#15803d' : '#b91c1c'};
          transform:rotate(-45deg);
          box-shadow:0 2px 6px rgba(0,0,0,.4);
          transition:all .2s;
        "></div>`,
        iconSize:   [28, 28],
        iconAnchor: [14, 28],
      })

      const marker = L.marker([p.lat, p.lon], { icon })
        .addTo(map)
        .on('click', () => {
          onSelect(toRelayPoint(p))
        })

      markersRef.current.set(p.id, marker)
      bounds.push([p.lat, p.lon])
    })

    if (bounds.length) map.fitBounds(bounds, { padding: [30, 30] })
  }, [points, selected, onSelect])

  // ── Highlight du marqueur survolé ─────────────────────────────────────────
  useEffect(() => {
    // rien d'interactif côté Leaflet pour le hover (marqueurs recréés sur select)
  }, [hovered])

  const isComplete = /^\d{5}$/.test(codePostal)

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-white/10 bg-black/20">

      {/* Header */}
      <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2">
        <MapPin size={13} className="text-red-400 shrink-0" />
        <span className="text-white/70 text-xs font-semibold">Choisissez votre point relais</span>
      </div>

      {/* État : pas de CP */}
      {!isComplete && (
        <div className="px-3 py-4 text-center text-white/30 text-xs">
          Entrez votre code postal pour voir les points relais
        </div>
      )}

      {/* État : chargement */}
      {isComplete && loading && (
        <div className="px-3 py-5 flex items-center justify-center gap-2">
          <Loader2 size={16} className="text-white/40 animate-spin" />
          <span className="text-white/40 text-xs">Recherche des points relais…</span>
        </div>
      )}

      {/* État : erreur */}
      {isComplete && !loading && error && (
        <div className="px-3 py-3 text-center text-red-400/80 text-xs">{error}</div>
      )}

      {/* Résultats */}
      {!loading && !error && points.length > 0 && (
        <div className="flex flex-col">

          {/* Carte Leaflet */}
          <div ref={mapRef} style={{ height: 200, width: '100%' }} />

          {/* Liste des points */}
          <div className="divide-y divide-white/5 max-h-52 overflow-y-auto">
            {points.map(p => {
              const isSelected = selected && String(selected.id) === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelect(toRelayPoint(p))}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`w-full text-left px-3 py-2.5 transition-colors flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-green-500/10'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <MapPin
                    size={13}
                    className={`shrink-0 mt-0.5 ${isSelected ? 'text-green-400' : 'text-red-400/70'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold truncate ${isSelected ? 'text-green-400' : 'text-white/80'}`}>
                        {p.name}
                      </p>
                      {p.distance !== undefined && (
                        <span className="text-white/25 text-[10px] shrink-0">{p.distance} km</span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/35 truncate">{p.address}, {p.city}</p>
                  </div>
                  {isSelected && <CheckCircle2 size={13} className="text-green-400 shrink-0 mt-0.5" />}
                </button>
              )
            })}
          </div>

          {/* Point sélectionné */}
          {selected && (
            <div className="px-3 py-2.5 bg-green-500/10 border-t border-green-500/20 flex items-center gap-2">
              <CheckCircle2 size={13} className="text-green-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-green-400 text-xs font-semibold truncate">{selected.name}</p>
                <p className="text-white/35 text-[10px] truncate">{selected.address}, {selected.city}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
