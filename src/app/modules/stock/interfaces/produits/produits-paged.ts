import { Produit } from "./produit";

export interface ProduitsPaged {
    status: string;
    message: string;
    data: {
        data: Produit[],
        meta: {
            total: number,
            current_page: number,
            last_page: number,
            per_page: number,
            from: number,
            to: number
        }
    };

}
