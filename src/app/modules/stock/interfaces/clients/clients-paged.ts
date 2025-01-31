import { Client } from "./client";

export interface ClientsPaged {
        status: string;
        message: string;
        data: Client[];
}
