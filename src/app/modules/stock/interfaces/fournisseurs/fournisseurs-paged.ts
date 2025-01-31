import { Fournisseur } from "./fournisseur";

export interface FournisseursPaged {
        status: string;
        message: string;
        data: Fournisseur[];
}
