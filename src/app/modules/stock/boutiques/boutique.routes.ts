import { Routes } from "@angular/router";
import { ListBoutiquesComponent } from "./list-boutiques/list-boutiques.component";
import { AddBoutiqueComponent } from "./add-boutique/add-boutique.component";
import { UpdateBoutiqueComponent } from "./update-boutique/update-boutique.component";

export default [
    {
        path     : '',
        component: ListBoutiquesComponent,
    },
    {
        path     : 'add-boutique',
        component: AddBoutiqueComponent,
    },
    {
        path: 'update-boutique/:id',
        component: UpdateBoutiqueComponent
    }
] as Routes;