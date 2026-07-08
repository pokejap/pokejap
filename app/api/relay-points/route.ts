import { NextRequest, NextResponse } from 'next/server'

// Endpoints Overpass en fallback
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') ?? '')
  const lon = parseFloat(searchParams.get('lon') ?? '')

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: 'lat/lon requis' }, { status: 400 })
  }

  const query = `[out:json][timeout:15];
(
  node["brand"="Mondial Relay"](around:12000,${lat},${lon});
  node["operator"="Mondial Relay"](around:12000,${lat},${lon});
  node["name"~"Mondial Relay",i](around:12000,${lat},${lon});
);
out body;`

  let lastError: string = 'Toutes les tentatives ont échoué'

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, {
        headers: { 'User-Agent': 'PokeJap-checkout/1.0' },
        signal: AbortSignal.timeout(12_000),
      })
      if (!res.ok) { lastError = `HTTP ${res.status}`; continue }
      const data = await res.json()
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'public, s-maxage=3600' }, // cache 1h
      })
    } catch (e: any) {
      lastError = e.message ?? 'Erreur réseau'
    }
  }

  return NextResponse.json({ error: lastError }, { status: 502 })
}
