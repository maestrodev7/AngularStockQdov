import { Routes } from '@angular/router';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { AddClientComponent } from './add-client/add-client.component';
import { UpdateClientComponent } from './update-client/update-client.component';

export default [
    {
        path     : '',
        component: ListClientsComponent,
    },
    {
        path     : 'add-client',
        component: AddClientComponent,
    },
    {
        path     : 'update-client/:id',
        component: UpdateClientComponent,
    },
] as Routes;
