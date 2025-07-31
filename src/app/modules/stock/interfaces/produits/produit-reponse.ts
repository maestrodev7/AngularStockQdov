import { Produit } from "./produit";

export interface ProduitReponse {
    status: string;
    message: string;
    data: Produit;
}
