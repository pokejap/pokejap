'use client'
import { useEffect, useRef, useState } from 'react'
import { MapPin, Loader2, AlertCircle } from 'lucide-react'

export interface RelayPoint {
  id: number
  lat: number
  lon: number
  name: string
  address: string
  city: string
}

declare global {
  interface Window {
    L: any
    _selectRelay: (id: number) => void
  }
}

export default function RelayPicker({
  codePostal,
  ville,
  selected,
  onSelect,
}: {
  codePostal: string
  ville: string
  selected: RelayPoint | null
  onSelect: (relay: RelayPoint | null) => void
}) {
  const mapDiv   = useRef<HTMLDivElement>(null)
  const mapRef   = useRef<any>(null)
  const layerRef = useRef<any>(null)
  const relaysRef = useRef<RelayPoint[]>([])
  const onSelectRef = useRef(onSelect)

  const [relays,  setRelays]  = useState<RelayPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [ready,   setReady]   = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  // keep onSelect ref up-to-date
  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

  // keep relays ref up-to-date for the global callback
  useEffect(() => { relaysRef.current = relays }, [relays])

  // global popup button callback (Leaflet popups don't support React easily)
  useEffect(() => {
    window._selectRelay = (id: number) => {
      const r = relaysRef.current.find(x => x.id === id)
      if (r) onSelectRef.current(r)
    }
    return () => { delete (window as any)._selectRelay }
  }, [])

  // ── Load Leaflet CSS + JS from CDN ─────────────────────────────────────────
  useEffect(() => {
    if (window.L) { setReady(true); return }

    const css = document.createElement('link')
    css.rel  = 'stylesheet'
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(css)

    const js = document.createElement('script')
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    js.onload = () => setReady(true)
    document.head.appendChild(js)
  }, [])

  // ── Init map once Leaflet is ready ─────────────────────────────────────────
  useEffect(() => {
    if (!ready || !mapDiv.current || mapRef.current) return
    const L = window.L

    // Fix default icon paths broken by bundlers
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    mapRef.current   = L.map(mapDiv.current).setView([46.6, 1.9], 6)
    layerRef.current = L.layerGroup().addTo(mapRef.current)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current)
  }, [ready])

  // ── Fetch relay points when postal code changes ────────────────────────────
  useEffect(() => {
    if (!ready || codePostal.replace(/\s/g, '').length < 4) return
    const t = setTimeout(() => fetchRelays(codePostal, ville), 600)
    return () => clearTimeout(t)
  }, [codePostal, ville, ready])

  // ── Update markers when relays or selected change ─────────────────────────
  useEffect(() => {
    if (!ready || !layerRef.current) return
    const L = window.L
    layerRef.current.clearLayers()

    relays.forEach(relay => {
      const isSelected = selected?.id === relay.id
      const icon = L.divIcon({
        className: '',
        iconSize:  [30, 40],
        iconAnchor:[15, 40],
        html: `<div style="
          width:30px;height:40px;display:flex;align-items:center;justify-content:center;
          background:${isSelected ? '#ef4444' : '#2563eb'};
          border-radius:50% 50% 50% 0;transform:rotate(-45deg);
          border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,.4)">
          <span style="transform:rotate(45deg);color:white;font-size:14px">📦</span>
        </div>`,
      })

      const marker = L.marker([relay.lat, relay.lon], { icon })
      marker.bindPopup(`
        <div style="font-family:system-ui;min-width:190px;padding:2px">
          <p style="font-weight:700;margin:0 0 3px;font-size:13px">${relay.name}</p>
          ${relay.address ? `<p style="color:#555;margin:0 0 2px;font-size:12px">${relay.address}</p>` : ''}
          <p style="color:#555;margin:0 0 10px;font-size:12px">${relay.city}</p>
          <button onclick="window._selectRelay(${relay.id})" style="
            background:${isSelected ? '#16a34a' : '#ef4444'};color:white;border:none;
            padding:7px 14px;border-radius:8px;cursor:pointer;font-weight:700;
            font-size:12px;width:100%;transition:opacity .2s
          ">${isSelected ? '✓ Sélectionné' : 'Choisir ce point'}</button>
        </div>
      `)
      layerRef.current.addLayer(marker)
    })
  }, [relays, selected, ready])

  async function fetchRelays(cp: string, city: string) {
    setLoading(true)
    setError(null)
    try {
      // 1 — Géocode le code postal via Nominatim
      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(cp.trim())}&country=France&format=json&limit=1`,
        { headers: { 'User-Agent': 'PokeJap-checkout/1.0' } }
      )
      const geoData = await geo.json()
      if (!geoData.length) {
        setError('Code postal introuvable — vérifiez votre saisie.')
        setLoading(false)
        return
      }

      const lat = parseFloat(geoData[0].lat)
      const lon = parseFloat(geoData[0].lon)

      if (mapRef.current) mapRef.current.setView([lat, lon], 13)

      // 2 — Requête Overpass API pour les points Mondial Relay
      const q = `[out:json][timeout:20];
(
  node["brand"="Mondial Relay"](around:12000,${lat},${lon});
  node["operator"="Mondial Relay"](around:12000,${lat},${lon});
  node["name"~"Mondial Relay",i](around:12000,${lat},${lon});
  node["name"~"Point Relais",i](around:12000,${lat},${lon});
);
out body;`
      const res  = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q)}`)
      const data = await res.json()

      // Déduplique par id
      const seen = new Set<number>()
      const points: RelayPoint[] = data.elements
        .filter((el: any) => el.lat && el.lon && !seen.has(el.id) && seen.add(el.id))
        .map((el: any) => ({
          id:      el.id,
          lat:     el.lat,
          lon:     el.lon,
          name:    el.tags?.name || 'Point Relais Mondial Relay',
          address: [el.tags?.['addr:housenumber'], el.tags?.['addr:street']].filter(Boolean).join(' '),
          city:    el.tags?.['addr:city'] || el.tags?.['addr:postcode'] || city,
        }))

      setRelays(points)

      if (!points.length) {
        setError('Aucun point relais trouvé à proximité. Essayez un code postal voisin.')
      }
    } catch {
      setError('Erreur réseau — impossible de charger les points relais.')
    } finally {
      setLoading(false)
    }
  }

  const hint = codePostal.replace(/\s/g, '').length < 4

  return (
    <div className="mt-3 space-y-2">

      {/* Instruction */}
      {hint && (
        <p className="text-white/35 text-[11px] flex items-center gap-1.5">
          <MapPin size={11} /> Entrez votre code postal pour afficher les points relais
        </p>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-white/40 text-[11px] flex items-center gap-1.5">
          <Loader2 size={11} className="animate-spin" /> Chargement des points relais…
        </p>
      )}

      {/* Erreur */}
      {error && !loading && (
        <p className="text-orange-400 text-[11px] flex items-center gap-1.5">
          <AlertCircle size={11} /> {error}
        </p>
      )}

      {/* Carte */}
      <div
        ref={mapDiv}
        className="w-full rounded-xl overflow-hidden border border-white/10 transition-opacity"
        style={{ height: 280, opacity: hint ? 0.3 : 1 }}
      />

      {/* Point sélectionné */}
      {selected && (
        <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/25 rounded-xl px-3 py-2.5">
          <MapPin size={13} className="text-green-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-green-400 text-xs font-semibold truncate">{selected.name}</p>
            {selected.address && <p className="text-white/40 text-[11px]">{selected.address}</p>}
            <p className="text-white/40 text-[11px]">{selected.city}</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-white/25 hover:text-white/60 text-sm leading-none ml-1"
          >✕</button>
        </div>
      )}

      {!hint && !loading && relays.length > 0 && !selected && (
        <p className="text-white/30 text-[11px] text-center">
          Cliquez sur un marqueur 📦 pour choisir votre point relais
        </p>
      )}
    </div>
  )
}
