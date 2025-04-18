import { AddAchatsComponent } from "./add-achats/AddAchats/AddAchats.component";
import { ListAchatsComponent } from "./list-achats/list-achats.component";
import { UpdateAchatComponent } from "./update-achat/update-achat/update-achat.component";

export default [
    {
        path: '',
        component: ListAchatsComponent
    },
    {
        path: 'update-achat/:id',
        component: UpdateAchatComponent
    },
    {
        path: 'add-achat',
        component: AddAchatsComponent,
    }
]
