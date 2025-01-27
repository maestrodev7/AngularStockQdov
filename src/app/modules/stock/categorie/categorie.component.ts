import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [MatButtonModule,MatListModule,MatIcon,MatFormFieldModule,FormsModule,MatInputModule],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.scss'
})
export class CategorieComponent {
  deteCategory(){

  }
}
