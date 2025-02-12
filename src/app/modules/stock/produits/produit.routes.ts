import { Routes } from "@angular/router";
import { ListProduitsComponent } from "./list-produits/list-produits.component";
import { AddProduitComponent } from "./add-produit/add-produit.component";
import { UpdateProduitComponent } from "./update-produit/update-produit.component";
export default [
    {
        path     : '',
        component: ListProduitsComponent,
    },
    {
        path    : 'add-produit',
        component: AddProduitComponent
    },
    {
        path    : 'update-produit/:id',
        component: UpdateProduitComponent
    }
] as Routes;