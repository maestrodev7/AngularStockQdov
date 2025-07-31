import { Routes } from "@angular/router";
import { ListProduitsComponent } from "./list-produits/list-produits.component";
import { AddProduitComponent } from "./add-produit/add-produit.component";
import { UpdateProduitComponent } from "./update-produit/update-produit.component";
import { DetailProduitComponent } from "./detail-produit/detail-produit.component";
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
    },
    {
        path    : 'detail-produit/:id',
        component: DetailProduitComponent
    }
] as Routes;
