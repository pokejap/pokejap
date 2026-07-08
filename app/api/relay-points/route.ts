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

// Hash requis par Mondial Relay :
// MD5(Enseigne + Pays + Ville + CP + Lat + Lon + Taille + Poids + Action + DelaiEnvoi + Rayon + TypeAct + NACE + NbRes + Secret)
function computeSecurity(
  enseigne: string, pays: string, cp: string,
  rayon: string, nb: string, secret: string
): string {
  const str = enseigne + pays + '' + cp + '' + '' + '' + '' + '' + '0' + rayon + '' + '' + nb + secret
  return md5upper(str)
}

function parseSOAP(xml: string): RelayPointData[] {
  const points: RelayPointData[] = []

  // Vérifier code erreur STAT (0 = succès)
  const stat = xml.match(/<STAT>(.*?)<\/STAT>/)?.[1]
  if (stat && stat !== '0') {
    console.error('[relay] SOAP STAT =', stat)
    return []
  }

  const regex = /<PointRelais>([\s\S]*?)<\/PointRelais>/g
  let m: RegExpExecArray | null

  while ((m = regex.exec(xml)) !== null) {
    const b = m[1]
    const g = (tag: string) => b.match(new RegExp(`<${tag}>(.*?)<\\/${tag}>`))?.[1]?.trim() ?? ''

    const lat = parseFloat(g('Latitude').replace(',', '.'))
    const lon = parseFloat(g('Longitude').replace(',', '.'))
    if (!lat || !lon) continue

    // Distance retournée en mètres × 10, on convertit en km
    const distRaw = parseFloat(g('Distance')) || 0

    points.push({
      id:       g('Num'),
      name:     g('LgAdr1'),
      address:  g('LgAdr3') || g('LgAdr2'),
      city:     g('Ville'),
      cp:       g('CP'),
      lat,
      lon,
      distance: distRaw ? Math.round(distRaw / 100) / 10 : undefined,
    })
  }

  return points
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cp = searchParams.get('cp')?.trim() ?? ''

  if (!cp || !/^\d{5}$/.test(cp)) {
    return NextResponse.json({ error: 'Code postal invalide' }, { status: 400 })
  }

  const ENSEIGNE = (process.env.MONDIAL_RELAY_ENSEIGNE ?? 'BDTEST13').trim()
  const SECRET   = (process.env.MONDIAL_RELAY_SECRET   ?? 'PrivateK').trim()
  const PAYS = 'FR'
  const RAYON = '25'
  const NB = '10'

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

  try {
    const res = await fetch('https://api.mondialrelay.com/Web_Services.asmx', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction':   '"http://www.mondialrelay.fr/WSI_SearchDeliveryPoint"',
        'User-Agent':   'PokeJap/1.0',
      },
      body: soapBody,
      signal: AbortSignal.timeout(12_000),
    })

    if (!res.ok) {
      console.error('[relay] SOAP HTTP', res.status)
      return NextResponse.json({ error: `Mondial Relay API ${res.status}` }, { status: 502 })
    }

    const xml = await res.text()
    const points = parseSOAP(xml)

    return NextResponse.json({ points }, {
      headers: { 'Cache-Control': 'public, s-maxage=1800' },
    })
  } catch (e: any) {
    console.error('[relay]', e)
    return NextResponse.json({ error: e.message }, { status: 502 })
  }
}
