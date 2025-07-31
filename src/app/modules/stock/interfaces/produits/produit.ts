export interface Produit {
    id: number;
    nom: string;
    description?: string;
    prix_achat: number | string;
    prix_vente: number | string;
    categorie_id: number;
    date_peremption?: string;
    type?: number;
    quantite: number;
    magasin_id?: number;
    from_magazin: boolean;
    boutique_id?: number;
    created_at?: string;
    updated_at?: string;
    tailles?: Taille[];
}
export interface Taille {
  id: number;
  produit_id: number;
  taille: string;
  prix_achat: number | string;
  prix_vente: number | string;
  quantite: number;
  created_at?: string;
  updated_at?: string;
}
