import { Boutique } from "./boutique";

export interface BoutiquesPaged {
    status: string;
    message: string;
    data: Boutique[];
}
