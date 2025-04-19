import { Transfert } from "./Tranfert";

export interface ResponseTransfert {
    status: string;
    message: string;
    data: Transfert;
}
