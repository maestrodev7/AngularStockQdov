import { Routes } from '@angular/router';
import { ListFournisseursComponent } from './list-fournisseurs/list-fournisseurs.component';
import { AddFournisseurComponent } from './add-fournisseur/add-fournisseur.component';
import { UpdateFounisseurComponent } from './update-founisseur/update-founisseur.component';

export default [
    {
        path     : '',
        component: ListFournisseursComponent,
    },
    {
        path     : 'add-fournisseur',
        component: AddFournisseurComponent,
    },
    {
        path     : 'update-fournisseur/:id',
        component: UpdateFounisseurComponent,
    },
] as Routes;
