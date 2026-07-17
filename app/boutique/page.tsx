'use client'
import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X, ArrowLeft } from 'lucide-react'
import { products, getRaretes, getLangues } from '@/data/products'
import ProductCard from '@/components/ProductCard'

const conditions = ['Neuf', 'Quasi-Neuf', 'Excellent', 'Bon', 'Moyen']
const LANG_LABELS: Record<string, string> = { JAP: '🇯🇵 Japonaise', EN: '🇺🇸 Anglaise', FR: '🇫🇷 Francaise' }

const LOGO_CDN = 'https://den-media.pokellector.com/logos'
const IMG      = 'https://den-cards.pokellector.com'

// ── Meilleure carte pour le fond de chaque tuile (SAR / CHR / ex en priorité) ─
const SET_COVER: Record<string, string> = {
  'VMAX Climax__JAP':              `${IMG}/338/Houndoom.S8B.206.41265.png`,         // Démolosse Secret Rare ✨
  'Arcanes Incandescentes__JAP':   `${IMG}/352/Smeargle.S11A.73.44587.png`,        // Queulorior CHR
  'Zénith Suprême__JAP':           `${IMG}/357/Toxtricity.S12A.181.45943.png`,      // Salarsen CHR
  'Écarlate ex__JAP':              `${IMG}/361/Klawf.SV1S.88.46813.png`,            // Klawf AR
  'Violet ex__JAP':                `${IMG}/362/Mabosstiff.SV1V.88.46820.png`,       // Mabosstiff AR
  'Triple Battue__JAP':            `${IMG}/366/Pyroar.SV1A.77.46997.png`,           // Némélion AR
  'Éruption de Glaise__JAP':       `${IMG}/370/Flamigo.SV2D.82.47066.png`,          // Flamigo AR
  'Risque de Grêle__JAP':          `${IMG}/369/Dudunsparce.SV2P.83.47037.png`,      // Dudunsparce AR
  'Flamme Obsidienne__JAP':        `${IMG}/368/Varoom.SV3.117.48739.png`,           // Varoom AR
  'Rugissement Antique__JAP':      `${IMG}/381/Roaring-Moon-ex.SV4K.93.50825.png`,  // Roaring Moon ex SAR ✨
  'Éclair Futur__JAP':             `${IMG}/382/Tulip.SV4K.87.50914.png`,            // Tulipe SAR ✨
  'Force Temporelle__JAP':         `${IMG}/386/Torterra-ex.SV5K.84.52239.png`,      // Torterra ex
  'Cyber Juge__JAP':               `${IMG}/387/Iron-Leaves-ex.SV5M.93.51711.png`,   // Iron Leaves ex SAR ✨
  'Brume Carmin__JAP':             `${IMG}/391/Torkoal.SV5A.69.52825.png`,          // Chartor AR
  'Mascarade Crépusculaire__JAP':  `${IMG}/393/Chansey.SV6.113.52894.png`,          // Leveinard AR
  'Erreurs Nocturnes__JAP':        `${IMG}/398/Munkidori-ex.SV6A.80.53585.png`,     // Munkidori ex SAR ✨
  'Couronne Stellaire__JAP':       `${IMG}/400/Terapagos-ex.SCR.173.54252.png`,     // Terapagos ex SAR ✨
  'Paradis Dragona__JAP':          `${IMG}/403/Flapple.SV7A.74.54040.png`,          // Flapple AR
  'Super Briseur Électrique__JAP': `${IMG}/405/Vivillon.SV8.107.54500.png`,         // Prismillon AR
  'Voyage Ensemble__JAP':          `${IMG}/408/Articuno.SV9.102.55538.png`,         // Artikodin AR ✨
  'Méga Bravoure__JAP':            `${IMG}/416/Exeggutor.M1L.66.58867.png`,         // Noadkoko AR
  'Méga Symphonie__JAP':           `${IMG}/417/Delibird.M1S.74.58951.png`,          // Cadoizo AR
  'Foudre Noire__JAP':             `${IMG}/414/Ns-Plot.SV11B.173.57888.png`,        // Plan de N SAR ✨
  'Flamme Blanche__JAP':           `${IMG}/415/Hydreigon-ex.SV11W.171.57965.png`,   // Trioxhydre ex SAR ✨
  'Foudre Noire__FR':              `${IMG}/420/Kyurem-ex.BLK.157.58338.png`,        // Kyurem ex Ultra Rare
  'Aventure Ensemble__FR':         'https://www.pokepedia.fr/images/8/80/Carte_%C3%89carlate_et_Violet_Aventures_Ensemble_164.png', // Ribombelle de Lilie AR
  'Failles Temporelles__FR':         'https://www.pokepedia.fr/images/2/25/Carte_%C3%89carlate_et_Violet_Forces_Temporelles_051_%28Logo_de_la_Journ%C3%A9e_Pok%C3%A9mon_2026%29.png',         // Pikachu Journée Pokémon
  'Flammes Fantomatiques__FR':       'https://www.pokepedia.fr/images/a/a5/Carte_M%C3%A9ga-%C3%89volution_Flammes_Fantasmagoriques_100.png',           // Zacian Illustration Rare
  'Méga-Évolutions Ancien__FR':      'https://www.pokepedia.fr/images/7/7d/Carte_M%C3%A9ga-%C3%89volution_036.png',   // Méga-Blizzaroi ex
  'Méga-Évolutions Promos__FR':      'https://www.pokepedia.fr/images/a/a1/Carte_Promo_ME_022.png',            // Charbambin Promo
}

// ── Logos officiels — clé = "NomSérie__LANGUE" ────────────────────────────────
const SET_LOGOS: Record<string, string> = {
  // ── JAP ──────────────────────────────────────────────────────────────────────
  'VMAX Climax__JAP':              `${LOGO_CDN}/VMAX-Climax.logo.338.png`,
  'Arcanes Incandescentes__JAP':   `${LOGO_CDN}/Incandescent-Arcana.logo.352.png`,
  'Zénith Suprême__JAP':           `${LOGO_CDN}/VSTAR-Universe.logo.357.png`,
  'Écarlate ex__JAP':              `${LOGO_CDN}/Scarlet-ex.logo.361.png`,
  'Violet ex__JAP':                `${LOGO_CDN}/Violet-ex.logo.362.png`,
  'Triple Battue__JAP':            `${LOGO_CDN}/Triple-Beat.logo.366.png`,
  'Éruption de Glaise__JAP':       `${LOGO_CDN}/Clay-Burst.logo.370.png`,
  'Risque de Grêle__JAP':          `${LOGO_CDN}/Snow-Hazard.logo.369.png`,
  'Flamme Obsidienne__JAP':        `${LOGO_CDN}/Ruler-of-the-Black-Flame.logo.368.png`,
  'Rugissement Antique__JAP':      `${LOGO_CDN}/Ancient-Roar.logo.381.png`,
  'Éclair Futur__JAP':             `${LOGO_CDN}/Future-Flash.logo.382.png`,
  'Force Temporelle__JAP':         `${LOGO_CDN}/Wild-Force.logo.386.png`,
  'Cyber Juge__JAP':               `${LOGO_CDN}/Cyber-Judge.logo.387.png`,
  'Brume Carmin__JAP':             `${LOGO_CDN}/Crimson-Haze.logo.391.png`,
  'Mascarade Crépusculaire__JAP':  `${LOGO_CDN}/Mask-of-Change.logo.393.png`,
  'Erreurs Nocturnes__JAP':        `${LOGO_CDN}/Night-Wanderer.logo.398.png`,
  'Couronne Stellaire__JAP':       `${LOGO_CDN}/Stella-Miracle.logo.401.png`,
  'Paradis Dragona__JAP':          `${LOGO_CDN}/Paradise-Dragona.logo.403.png`,
  'Super Briseur Électrique__JAP': `${LOGO_CDN}/Super-Electric-Breaker.logo.405.png`,
  'Voyage Ensemble__JAP':          `${LOGO_CDN}/Battle-Partners.logo.408.png`,
  'Méga Bravoure__JAP':            `${LOGO_CDN}/Mega-Brave.logo.416.png`,
  'Méga Symphonie__JAP':           `${LOGO_CDN}/Mega-Symphonia.logo.417.png`,
  'Foudre Noire__JAP':             `${LOGO_CDN}/Black-Bolt.logo.414.png`,
  'Flamme Blanche__JAP':           `${LOGO_CDN}/White-Flare.logo.415.png`,
  // ── FR — logos version occidentale ───────────────────────────────────────────
  'Foudre Noire__FR':              `${LOGO_CDN}/Black-Bolt.logo.420.png`,
  'Aventure Ensemble__FR':         `${LOGO_CDN}/Journey-Together.logo.409.png`,
  // ── FR — nouveaux sets ———————————————————————————————————————————————————
  'Failles Temporelles__FR':         `${LOGO_CDN}/Temporal-Forces.logo.383.png`,
  'Flammes Fantomatiques__FR':       `${LOGO_CDN}/Phantasmal-Flames.logo.424.png`,
  'Méga-Évolutions Ancien__FR':      `${LOGO_CDN}/Mega-Evolution.logo.422.png`,
  'Méga-Évolutions Promos__FR':      `${LOGO_CDN}/Mega-Evolution-Black-Star-Promos.logo.423.png`,
}

// ── Set metadata ─────────────────────────────────────────────────────────────
interface SetMeta {
  key: string          // "NomSérie__LANGUE"
  set: string
  language: string
  count: number
  logoUrl: string
  coverCardUrl: string // image d'une carte pour le fond
}

function buildSetMeta(): SetMeta[] {
  const byKey: Record<string, SetMeta> = {}

  for (const p of products) {
    const key = `${p.set}__${p.language}`
    if (!byKey[key]) {
      byKey[key] = {
        key, set: p.set, language: p.language, count: 0,
        logoUrl: SET_LOGOS[key] ?? '',
        coverCardUrl: SET_COVER[key] ?? p.imageUrl, // belle carte manuelle, sinon fallback
      }
    }
    byKey[key].count++
  }

  const seen = new Set<string>()
  const ordered: SetMeta[] = []
  for (const p of products) {
    const key = `${p.set}__${p.language}`
    if (!seen.has(key)) { seen.add(key); ordered.push(byKey[key]) }
  }
  return ordered
}

const ALL_SETS = buildSetMeta()
const JAP_SETS = ALL_SETS.filter(s => s.language === 'JAP')
const FR_SETS  = ALL_SETS.filter(s => s.language === 'FR')

// ── Set Tile ──────────────────────────────────────────────────────────────────
function SetTile({ meta, onClick }: { meta: SetMeta; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative group rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d14] hover:border-pokemon-red/60 transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:shadow-red-900/40 text-left"
      style={{ minHeight: 180 }}
    >
      {/* ── Fond : illustration d'une carte (floutée + assombrie) ── */}
      <img
        src={meta.coverCardUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center scale-110 opacity-50 group-hover:opacity-65 group-hover:scale-115 transition-all duration-500"
      />

      {/* Gradient d'assombrissement */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Glow rouge au hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)]" />

      {/* Badge nombre de cartes */}
      <span className="absolute top-2.5 left-2.5 bg-pokemon-red/90 text-white text-[10px] font-bold rounded-full px-2 py-0.5 z-10 shadow">
        {meta.count} carte{meta.count > 1 ? 's' : ''}
      </span>

      {/* Badge langue */}
      <span className="absolute top-2.5 right-2.5 text-sm bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 z-10">
        {meta.language === 'JAP' ? '🇯🇵' : '🇫🇷'}
      </span>

      {/* Logo officiel de l'édition */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 p-4 pt-10 pb-5 h-full">
        {meta.logoUrl ? (
          <img
            src={meta.logoUrl}
            alt={meta.set}
            className="w-full max-h-[72px] object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-white font-black text-sm text-center">{meta.set}</span>
        )}

        {/* Nom de l'édition */}
        <p className="text-gray-300 group-hover:text-white text-[11px] font-semibold text-center leading-tight transition-colors duration-200">
          {meta.set}
        </p>
      </div>
    </button>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BoutiquePage() {
  const [selectedKey, setSelectedKey] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('boutique-set') ?? null
    return null
  })

  const [search, setSearch]                       = useState('')
  const [selectedRarity, setSelectedRarity]       = useState('')
  const [selectedCondition, setSelectedCondition] = useState('')
  const [selectedLang, setSelectedLang]           = useState('')
  const [maxPrice, setMaxPrice]                   = useState(500)
  const [sort, setSort]                           = useState('newest')
  const [filtersOpen, setFiltersOpen]             = useState(false)

  const raretes = getRaretes()
  const langues = getLangues()
  const clearFilters = () => { setSelectedRarity(''); setSelectedCondition(''); setSelectedLang(''); setMaxPrice(500); setSearch('') }

  // Restaure la position de scroll au retour d'une fiche produit
  useEffect(() => {
    const saved = sessionStorage.getItem('boutique-scroll')
    if (saved && selectedKey) {
      setTimeout(() => window.scrollTo({ top: parseInt(saved), behavior: 'instant' as ScrollBehavior }), 50)
      sessionStorage.removeItem('boutique-scroll')
    }
  }, [])

  const showAllJap = selectedKey === '__all_jap__'
  const showAllFr  = selectedKey === '__all_fr__'
  const showAll    = showAllJap || showAllFr
  const currentMeta = (!showAll && selectedKey) ? ALL_SETS.find(s => s.key === selectedKey) ?? null : null

  const filtered = useMemo(() => {
    if (!selectedKey) return []
    let result = showAllJap ? products.filter(p => p.language === 'JAP')
               : showAllFr  ? products.filter(p => p.language === 'FR')
               : products.filter(p => p.set === currentMeta!.set && p.language === currentMeta!.language)
    if (search)            { const q = search.toLowerCase(); result = result.filter(p => p.name.toLowerCase().includes(q)) }
    if (selectedRarity)    result = result.filter(p => p.rarity === selectedRarity)
    if (selectedCondition) result = result.filter(p => p.condition === selectedCondition)
    if (selectedLang)      result = result.filter(p => p.language === selectedLang)
    result = result.filter(p => p.price <= maxPrice)
    if (sort === 'price-asc')       result.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    else if (sort === 'name-asc')   result.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'number-asc') result.sort((a, b) => parseInt(a.number) - parseInt(b.number))
    // sort === 'chrono' → ordre products.ts (déjà chronologique)
    return result
  }, [selectedKey, currentMeta, search, selectedRarity, selectedCondition, selectedLang, maxPrice, sort])

  const activeFilters = [selectedRarity, selectedCondition, selectedLang].filter(Boolean).length

  function handleSelectSet(key: string) { clearFilters(); setSelectedKey(key); sessionStorage.setItem('boutique-set', key); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function handleBack()                 { setSelectedKey(null); clearFilters(); sessionStorage.removeItem('boutique-set'); sessionStorage.removeItem('boutique-scroll'); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  // ── VUE SÉLECTION D'ÉDITIONS ─────────────────────────────────────────────────
  if (!selectedKey) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="mb-10">
          <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-1" translate="no">カード</p>
          <h1 className="text-4xl font-black text-white mb-1">La <span className="text-pokemon-red">Boutique</span></h1>
          <p className="text-gray-400 text-sm">{products.length} cartes · {ALL_SETS.length} éditions</p>
        </div>

        {/* Section Japonaises */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🇯🇵</span>
            <h2 className="text-xl font-black text-white">Japonaises</h2>
            <span className="text-xs text-gray-500 bg-white/5 border border-white/10 rounded-full px-3 py-1">{JAP_SETS.length} éditions</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {JAP_SETS.map(meta => <SetTile key={meta.key} meta={meta} onClick={() => handleSelectSet(meta.key)} />)}
            {/* Tuile "Toutes les cartes JAP" */}
            <button
              onClick={() => handleSelectSet('__all_jap__')}
              className="relative group rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d14] hover:border-pokemon-red/60 transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:shadow-red-900/40 flex flex-col items-center justify-center gap-3 p-4"
              style={{ minHeight: 180 }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)]" />
              <span className="relative z-10 text-4xl">🇯🇵</span>
              <p className="relative z-10 text-white font-black text-sm text-center leading-tight">Toutes les cartes</p>
              <span className="relative z-10 bg-pokemon-red/80 text-white text-[10px] font-bold rounded-full px-2.5 py-1">
                {products.filter(p => p.language === 'JAP').length} cartes
              </span>
            </button>
          </div>
        </section>

        {/* Section Françaises */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🇫🇷</span>
            <h2 className="text-xl font-black text-white">Françaises</h2>
            <span className="text-xs text-gray-500 bg-white/5 border border-white/10 rounded-full px-3 py-1">{FR_SETS.length} éditions</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {FR_SETS.map(meta => <SetTile key={meta.key} meta={meta} onClick={() => handleSelectSet(meta.key)} />)}
            {/* Tuile "Toutes les cartes FR" */}
            <button
              onClick={() => handleSelectSet('__all_fr__')}
              className="relative group rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d14] hover:border-pokemon-red/60 transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:shadow-red-900/40 flex flex-col items-center justify-center gap-3 p-4"
              style={{ minHeight: 180 }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)]" />
              <span className="relative z-10 text-4xl">🇫🇷</span>
              <p className="relative z-10 text-white font-black text-sm text-center leading-tight">Toutes les cartes</p>
              <span className="relative z-10 bg-pokemon-red/80 text-white text-[10px] font-bold rounded-full px-2.5 py-1">
                {products.filter(p => p.language === 'FR').length} cartes
              </span>
            </button>
          </div>
        </section>
      </div>
    )
  }

  // ── VUE CARTES ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-10">
      <div className="mb-6">
        <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Toutes les éditions
        </button>
        {showAll ? (
          <>
            <h1 className="text-4xl font-black text-white mb-1">
              {showAllJap ? '🇯🇵' : '🇫🇷'} Toutes les cartes <span className="text-pokemon-red">{showAllJap ? 'japonaises' : 'françaises'}</span>
            </h1>
            <p className="text-gray-400 text-sm">{filtered.length} cartes disponibles</p>
          </>
        ) : (
          <>
            {currentMeta!.logoUrl && (
              <img src={currentMeta!.logoUrl} alt={currentMeta!.set} className="h-12 object-contain drop-shadow-lg mb-2" />
            )}
            <p className="text-gray-400 text-sm">
              {currentMeta!.language === 'JAP' ? '🇯🇵 Japonaise' : '🇫🇷 Française'} · {filtered.length} carte{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
            </p>
          </>
        )}
      </div>

      {/* Barre recherche + tri + filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Rechercher une carte..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-pokemon-card border border-white/10 text-white placeholder-gray-500 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-pokemon-red" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="bg-pokemon-card border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none">
          <option value="newest">Chronologique</option>
          <option value="number-asc">Numéro de carte</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name-asc">Nom A-Z</option>
        </select>
        <button onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium transition-colors ${filtersOpen || activeFilters > 0 ? 'bg-pokemon-red border-pokemon-red text-white' : 'bg-pokemon-card border-white/10 text-gray-300'}`}>
          <SlidersHorizontal size={18} /> Filtres
          {activeFilters > 0 && <span className="bg-white text-pokemon-red text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeFilters}</span>}
        </button>
      </div>

      {/* Filtres avancés */}
      {filtersOpen && (
        <div className="bg-pokemon-card rounded-xl border border-white/10 p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-sm text-gray-400 font-medium mb-2 block">Rarete</label>
            <select value={selectedRarity} onChange={e => setSelectedRarity(e.target.value)} className="w-full bg-pokemon-dark border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none">
              <option value="">Toutes</option>{raretes.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 font-medium mb-2 block">Langue</label>
            <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)} className="w-full bg-pokemon-dark border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none">
              <option value="">Toutes</option>{langues.map(l => <option key={l} value={l}>{LANG_LABELS[l] ?? l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 font-medium mb-2 block">Etat</label>
            <select value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)} className="w-full bg-pokemon-dark border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none">
              <option value="">Tous</option>{conditions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 font-medium mb-2 block">Prix max: <span className="text-pokemon-yellow font-bold">{maxPrice} €</span></label>
            <input type="range" min={0} max={500} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-pokemon-red" />
          </div>
          {activeFilters > 0 && (
            <div className="col-span-full flex justify-end">
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"><X size={14} /> Reinitialiser tout</button>
            </div>
          )}
        </div>
      )}

      {/* Grille de cartes */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">😔</p>
          <p className="text-lg font-medium">Aucune carte trouvee</p>
          <button onClick={clearFilters} className="mt-4 text-pokemon-red hover:underline text-sm">Effacer les filtres</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  )
}
