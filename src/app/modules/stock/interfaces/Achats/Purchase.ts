export interface Purchase {
    id: number;
    supplier_id: number;
    product_id: number;
    quantity: number;
    price: number;
    total_price: number;
    created_at: string;
    updated_at: string;

    product?: {
        id: number;
        nom: string;
        description: string;
        prix_achat: number;
        prix_vente: number;
        categorie_id: number;
        date_peremption: string;
        type: string;
        quantite: number;
        magasin_id: number;
        boutique_id: number | null;
        created_at: string;
        updated_at: string;
    };

    fournisseur?: {
        id: number;
        nom: string;
        telephone: string;
        adresse: string;
        created_at: string;
        updated_at: string;
    };

  product_name?: string;
  supplier_name?: string;
  }
