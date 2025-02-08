import { Magazin } from "./magazin";

export interface MagazinsPaged {
    status: string;
    message: string;
    data: Magazin[];
}
