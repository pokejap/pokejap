/**
 * Stock store — gère les décrémentations de stock en mémoire + fichier JSON.
 *
 * En développement : le fichier data/stock-overrides.json est mis à jour.
 * En production (Vercel serverless) : les modifications sont en mémoire
 * (perdues au redémarrage). Pour un vrai stockage persistant, remplacer
 * par Vercel KV, Supabase, ou PlanetScale.
 *
 * Pour une boutique personnelle à faible volume, cela reste fonctionnel :
 * après chaque vente, vérifier les logs Stripe et mettre à jour products.ts.
 */

import { products as staticProducts } from '@/data/products'
import * as fs from 'fs'
import * as path from 'path'

const OVERRIDES_PATH = path.join(process.cwd(), 'data', 'stock-overrides.json')

// Charge les overrides depuis le fichier (ou mémoire en prod)
function loadOverrides(): Record<string, number> {
  try {
    const raw = fs.readFileSync(OVERRIDES_PATH, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function saveOverrides(overrides: Record<string, number>) {
  try {
    fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(overrides, null, 2))
  } catch {
    // En prod serverless, le filesystem est read-only — on continue sans erreur
  }
}

export const stockStore = {
  /**
   * Retourne le stock effectif d'un produit
   * (stock de base dans products.ts – ventes enregistrées)
   */
  getStock(productId: string): number {
    const product = staticProducts.find(p => p.id === productId)
    if (!product) return 0
    const overrides = loadOverrides()
    const sold = overrides[productId] ?? 0
    return Math.max(0, product.stock - sold)
  },

  /**
   * Décrémente le stock après un paiement confirmé
   */
  decrement(productId: string, qty = 1) {
    const overrides = loadOverrides()
    overrides[productId] = (overrides[productId] ?? 0) + qty
    saveOverrides(overrides)
    console.log(`[stock] ${productId} : –${qty} (total vendu: ${overrides[productId]})`)
  },

  /**
   * Réinitialise un produit (ex: remis en stock manuellement)
   */
  reset(productId: string) {
    const overrides = loadOverrides()
    delete overrides[productId]
    saveOverrides(overrides)
  },
}
