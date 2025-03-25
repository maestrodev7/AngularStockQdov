import { Sales } from "./Sales";

export interface ResponseSale {
        status: string;
        message: string;
        data: Sales;
}
