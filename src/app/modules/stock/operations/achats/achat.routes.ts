import { AddAchatsComponent } from "./add-achats/AddAchats/AddAchats.component";
import { ListAchatsComponent } from "./list-achats/list-achats.component";

export default [
    {
        path: '',
        component: ListAchatsComponent
    },
    {
        path     : 'add-achats',
        component: AddAchatsComponent,
    },
]
