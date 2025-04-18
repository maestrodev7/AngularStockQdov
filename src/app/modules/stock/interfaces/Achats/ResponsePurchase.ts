import { Purchase } from "./Purchase";

export interface ResponsePurchase {
        status: string;
        message: string;
        data: Purchase;
}
