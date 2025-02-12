import { Produit } from "./produit";

export interface ProduitsPaged {
    status: string;
    message: string;
    data: Produit[];
}
