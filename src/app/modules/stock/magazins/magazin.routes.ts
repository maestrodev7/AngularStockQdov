import { Routes } from "@angular/router";
import { ListMagazinsComponent } from "./list-magazins/list-magazins.component";
import { AddMagazinComponent } from "./add-magazin/add-magazin.component";
import { UpdateMagazinComponent } from "./update-magazin/update-magazin.component";

export default [
    {
        path     : '',
        component: ListMagazinsComponent,
    },
    {
        path     : 'add-magazin',
        component: AddMagazinComponent,
    },
    {
        path: 'update-magazin/:id',
        component: UpdateMagazinComponent
    }
] as Routes;