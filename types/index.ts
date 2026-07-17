export type Rarete =
  | 'Commune'
  | 'Peu Commune'
  | 'Rare'
  | 'Rare Holo'
  | 'Ultra Rare'
  | 'Secret Rare'
  | 'V'
  | 'VMAX'
  | 'ex'
  | 'GX'
  | 'AR'
  | 'CHR'
  | 'SAR'
  | 'UR'
  | 'Super Rare'
  | 'Promo'
  | 'Illustration Rare';

export type Condition = 'Neuf' | 'Quasi-Neuf' | 'Excellent' | 'Bon' | 'Moyen';
export type Langue = 'JAP' | 'FR' | 'EN';

export type ProductCategory = 'carte' | 'display' | 'etb' | 'booster' | 'coffret';

export interface Product {
  id: string;
  name: string;
  set: string;
  setCode: string;
  rarity: Rarete;
  condition: Condition;
  language: Langue;
  price: number;
  imageUrl: string;
  stock: number;
  number: string;
  description?: string;
  hp?: number;
  type?: string;
  // Produits scellés
  category?: ProductCategory;
  contents?: string[];
  logoUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
