import { Purchase } from "./Purchase";

export interface PurchasesPaged {
    status: string;
    message: string;
    data: Purchase[];
  }
