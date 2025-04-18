import { AddVenteComponent } from "./add-vente/add-vente.component";
import { ListVentesComponent } from "./list-ventes/list-ventes.component";
import { UpdateVenteComponent } from "./update-vente/update-vente.component";

export default [
    {
        path: '',
        component: ListVentesComponent
    },
    {
        path: 'update-vente/:id',
        component: UpdateVenteComponent
    },
    {
        path: 'add-vente',
        component: AddVenteComponent
    }
]
