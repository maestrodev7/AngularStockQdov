import { Entreprise } from "./entreprise";

export interface EntreprisesPaged {
    status: string;
    message: string;
    data: Entreprise[];
}
