import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

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

function md5upper(str: string): string {
  return createHash('md5').update(str, 'utf8').digest('hex').toUpperCase()
}

// MD5(Enseigne+Pays+Ville+CP+Lat+Lon+Taille+Poids+Action+DelaiEnvoi+Rayon+TypeAct+NACE+NbRes+Secret)
function computeSecurity(
  enseigne: string,
  pays: string,
  cp: string,
  rayon: string,
  nb: string,
  secret: string
): string {
  const str = enseigne + pays + '' + cp + '' + '' + '' + '' + '' + '0' + rayon + '' + '' + nb + secret
  return md5upper(str)
}

function parseSOAP(xml: string): { stat: string; points: RelayPointData[] } {
  const stat = xml.match(/<STAT>(.*?)<\/STAT>/)?.[1] ?? '-1'
  if (stat !== '0') return { stat, points: [] }

  const points: RelayPointData[] = []
  const regex = /<PointRelais>([\s\S]*?)<\/PointRelais>/g
  let m: RegExpExecArray | null

  while ((m = regex.exec(xml)) !== null) {
    const b = m[1]
    const g = (tag: string) =>
      b.match(new RegExp(`<${tag}>(.*?)<\\/${tag}>`))?.[1]?.trim() ?? ''

    const lat = parseFloat(g('Latitude').replace(',', '.'))
    const lon = parseFloat(g('Longitude').replace(',', '.'))
    if (!lat || !lon) continue

    const distRaw = parseFloat(g('Distance')) || 0

    points.push({
      id: g('Num'),
      name: g('LgAdr1'),
      address: g('LgAdr3') || g('LgAdr2'),
      city: g('Ville'),
      cp: g('CP'),
      lat,
      lon,
      distance: distRaw ? Math.round(distRaw / 100) / 10 : undefined,
    })
  }

  return { stat, points }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cp = searchParams.get('cp')?.trim() ?? ''

  if (!cp || !/^\d{5}$/.test(cp)) {
    return NextResponse.json({ error: 'Code postal invalide' }, { status: 400 })
  }

  const ENSEIGNE = (process.env.MONDIAL_RELAY_ENSEIGNE ?? 'BDTEST13').trim()
  const SECRET   = (process.env.MONDIAL_RELAY_SECRET   ?? 'PrivateK').trim()
  const PAYS     = 'FR'
  const RAYON    = '25'
  const NB       = '15'

  const security = computeSecurity(ENSEIGNE, PAYS, cp, RAYON, NB, SECRET)

  const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <WSI_SearchDeliveryPoint xmlns="http://www.mondialrelay.fr/">
      <Enseigne>${ENSEIGNE}</Enseigne>
      <Pays>${PAYS}</Pays>
      <NumPointRelais></NumPointRelais>
      <Ville></Ville>
      <CP>${cp}</CP>
      <Latitude></Latitude>
      <Longitude></Longitude>
      <Taille></Taille>
      <Poids></Poids>
      <Action></Action>
      <DelaiEnvoi>0</DelaiEnvoi>
      <RayonRecherche>${RAYON}</RayonRecherche>
      <TypeActivite></TypeActivite>
      <NACE></NACE>
      <NombreResultats>${NB}</NombreResultats>
      <Security>${security}</Security>
    </WSI_SearchDeliveryPoint>
  </soap:Body>
</soap:Envelope>`

  const ENDPOINTS = [
    'https://api.mondialrelay.com/Web_Services.asmx',
    'http://api.mondialrelay.com/Web_Services.asmx',
  ]

  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: 'http://www.mondialrelay.fr/WSI_SearchDeliveryPoint',
          'User-Agent': 'PokeJap/1.0',
        },
        body: soapBody,
        signal: AbortSignal.timeout(12_000),
      })

      const xml = await res.text()
      const { stat, points } = parseSOAP(xml)

      if (stat !== '0') {
        return NextResponse.json(
          { error: `Mondial Relay erreur STAT ${stat}`, stat },
          { status: 502 }
        )
      }

      if (!points.length) {
        // Credentials de test (BDTEST13) ont une couverture limitée.
        // Avec de vraies credentials merchant, tous les CP fonctionnent.
        const isTestCreds = ENSEIGNE === 'BDTEST13'
        return NextResponse.json(
          {
            error: isTestCreds
              ? 'Credentials de test : ajoutez MONDIAL_RELAY_ENSEIGNE et MONDIAL_RELAY_SECRET dans Vercel pour activer tous les points relais'
              : 'Aucun point relais trouvé dans ce secteur',
            noCredentials: isTestCreds,
          },
          { status: isTestCreds ? 503 : 404 }
        )
      }

      return NextResponse.json(
        { points },
        { headers: { 'Cache-Control': 'public, s-maxage=1800' } }
      )
    } catch (e: any) {
      console.error('[relay] endpoint', endpoint, e.message)
      continue
    }
  }

  return NextResponse.json(
    { error: 'Impossible de contacter Mondial Relay' },
    { status: 502 }
  )
}
