import { Product } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
//  CDN Hikaru Distribution — produits FR
// ─────────────────────────────────────────────────────────────────────────────
const H = 'https://cdn.shopify.com/s/files/1/0798/3313/7485/files'

// ─────────────────────────────────────────────────────────────────────────────
//  PRODUITS SCELLÉS FRANÇAIS — TCGdirect B2B uniquement
//  Prix vente TTC = prix TCGdirect HT × 1.60 (marge brute 25%)
// ─────────────────────────────────────────────────────────────────────────────

export const sealedFrProducts: Product[] = [

  // ════════════════════════════════════════════════════════════════
  //  📦  DISPLAYS FRANÇAIS
  // ════════════════════════════════════════════════════════════════

  {
    id: 'display-fr-me03',
    name: 'Display Équilibre Parfait – ME03',
    set: 'Équilibre Parfait',
    setCode: 'ME03',
    category: 'display',
    rarity: 'Rare',
    condition: 'Neuf',
    language: 'FR',
    price: 287.9,
    stock: 0,
    number: '',
    description: `Display officiel de la série Méga-Évolution 3 en version française. 36 boosters scellés pour explorer l'extension Équilibre Parfait et traquer les versions Full Art, SAR et Gold des Pokémon emblématiques. Sortie officielle le 27 mars 2026.`,
    contents: [
      '36 boosters Équilibre Parfait (ME03)',
      '10 cartes par booster',
      'Full Art, SAR, Gold et Méga-Évolutions rares',
      'Produit officiel Pokémon – scellé sous cellophane',
      'Expédié depuis la France',
    ],
    imageUrl: `${H}/DisplayME03equilibreparfaitFR.png`,
  },

  // ════════════════════════════════════════════════════════════════
  //  🎁  ETB — COFFRETS DRESSEUR D'ÉLITE FRANÇAIS
  // ════════════════════════════════════════════════════════════════

  {
    id: 'etb-fr-me03',
    name: 'ETB Équilibre Parfait – ME03',
    set: 'Équilibre Parfait',
    setCode: 'ME03',
    category: 'etb',
    rarity: 'Rare',
    condition: 'Neuf',
    language: 'FR',
    price: 84.9,
    stock: 0,
    number: '',
    description: `Coffret Dresseur d'Élite officiel de l'extension Équilibre Parfait (ME03). Contient 9 boosters et une carte promo exclusive Ptyranidur. Inclut les accessoires dresseur complets. Sortie officielle le 27 mars 2026.`,
    contents: [
      '9 boosters Équilibre Parfait (ME03)',
      '1 carte promo exclusive Ptyranidur',
      '65 protège-cartes Méga-Dracolosse, 45 Énergies, dés, marqueurs et livret',
      'Produit officiel Pokémon – scellé sous cellophane',
    ],
    imageUrl: `${H}/CoffretDresseurd_EliteMega-Evolution-EquilibreParfaiteETBFR_589a42fb-0233-4a37-ba43-f555815f6122.png`,
  },

  // ════════════════════════════════════════════════════════════════
  //  🎀  COFFRETS FRANÇAIS
  // ════════════════════════════════════════════════════════════════

  {
    id: 'coffret-fr-mega-kangourex',
    name: 'Coffret Méga-Kangourex EX – ME2',
    set: 'Méga-Évolution 2',
    setCode: 'ME2',
    category: 'coffret',
    rarity: 'Rare',
    condition: 'Neuf',
    language: 'FR',
    price: 47.9,
    stock: 0,
    number: '',
    description: `Coffret collector vintage mettant à l'honneur Méga-Kangourex EX. Édition ME2 avec cartes promos exclusives. Pour les nostalgiques de la Méga-Évolution.`,
    contents: [
      'Boosters Méga-Évolution 2',
      'Carte promo Méga-Kangourex EX exclusive',
      'Accessoires de jeu',
      'Produit officiel Pokémon scellé',
    ],
    imageUrl: `${H}/Coffret-Mega-Evolution-Mega-KangourexEX_ME2_Francais.png`,
  },

]
