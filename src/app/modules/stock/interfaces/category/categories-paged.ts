import { Category } from "./category";

export interface CategoriesPaged {
    status: string;
    message: string;
    data: Category[];
}
