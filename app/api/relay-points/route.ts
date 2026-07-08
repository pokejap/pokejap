import { NextRequest, NextResponse } from 'next/server'

export interface RelayPointData {
  id: string
  name: string
  address: string
  city: string
  cp: string
  lat: number
  lon: number
  distance?: number
}

const BASE_URL = 'https://www.mondialrelay.fr'
const RELAY_PAGE = `${BASE_URL}/trouver-le-point-relais-le-plus-proche-de-chez-moi/`
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/** Récupère les cookies de session + le token CSRF depuis la page de recherche MR */
async function getSessionAndToken(): Promise<{ cookieStr: string; token: string }> {
  const res = await fetch(RELAY_PAGE, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'fr-FR,fr;q=0.9',
      'User-Agent': USER_AGENT,
    },
    signal: AbortSignal.timeout(10_000),
  })

  if (!res.ok) throw new Error(`Page MR ${res.status}`)

  const html = await res.text()

  // Extraire token CSRF ASP.NET
  const token =
    html.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/)?.[1] ??
    html.match(/value="([^"]+)"[^>]*name="__RequestVerificationToken"/)?.[1] ??
    ''

  if (!token) throw new Error('Token CSRF introuvable')

  // Combiner tous les Set-Cookie en une chaîne cookie: name=value; name=value
  const cookieHeaders: string[] =
    typeof (res.headers as any).getSetCookie === 'function'
      ? (res.headers as any).getSetCookie()
      : [res.headers.get('set-cookie') ?? '']

  const cookieStr = cookieHeaders
    .map(c => c.split(';')[0].trim())
    .filter(Boolean)
    .join('; ')

  return { cookieStr, token }
}

/** Appelle l'API parcelshop de mondialrelay.fr et retourne les points relais */
async function fetchParcelshops(cp: string): Promise<RelayPointData[]> {
  const { cookieStr, token } = await getSessionAndToken()

  const params = new URLSearchParams({
    country: 'FR',
    postcode: cp,
    city: '',
    services: '',
    excludeSat: 'false',
    naturesAllowed: '1,A,E,F,D,J,T,S,C',
  })

  const apiRes = await fetch(`${BASE_URL}/api/parcelshop?${params}`, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'fr-FR',
      Cookie: cookieStr,
      RequestVerificationToken: token,
      Referer: RELAY_PAGE,
      'User-Agent': USER_AGENT,
      'X-Requested-With': 'XMLHttpRequest',
    },
    signal: AbortSignal.timeout(12_000),
  })

  if (!apiRes.ok) {
    const body = await apiRes.text().catch(() => '')
    throw new Error(`Mondial Relay API ${apiRes.status}: ${body.slice(0, 100)}`)
  }

  const data = await apiRes.json()

  if (!Array.isArray(data)) {
    throw new Error(`Réponse inattendue: ${JSON.stringify(data).slice(0, 100)}`)
  }

  return data
    .filter((p: any) => p?.Adresse?.Latitude && p?.Adresse?.Longitude)
    .slice(0, 15)
    .map((p: any) => ({
      id: String(p.Numero ?? ''),
      name: p.Adresse.Libelle ?? '',
      address: p.Adresse.AdresseLigne1 ?? '',
      city: p.Adresse.Ville ?? '',
      cp: p.Adresse.CodePostal ?? cp,
      lat: p.Adresse.Latitude,
      lon: p.Adresse.Longitude,
    }))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cp = searchParams.get('cp')?.trim() ?? ''

  if (!cp || !/^\d{5}$/.test(cp)) {
    return NextResponse.json({ error: 'Code postal invalide' }, { status: 400 })
  }

  try {
    const points = await fetchParcelshops(cp)

    if (!points.length) {
      return NextResponse.json(
        { error: 'Aucun point relais trouvé dans ce secteur' },
        { status: 404 }
      )
    }

    return NextResponse.json({ points }, {
      headers: { 'Cache-Control': 'public, s-maxage=1800' },
    })
  } catch (e: any) {
    console.error('[relay-points]', e.message)
    return NextResponse.json({ error: e.message }, { status: 502 })
  }
}
