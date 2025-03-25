import { Sales } from "./Sales";

export interface SalesPages {
    status: string;
    message: string;
    data: Sales[];
}
