import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Fournisseur } from '../../interfaces/fournisseurs/fournisseur';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PeriodicElement } from '../../clients/list-clients/list-clients.component';
import { FournisseurService } from '../../services/fournisseurs/fournisseur.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FournisseursPaged } from '../../interfaces/fournisseurs/fournisseurs-paged';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-list-fournisseurs',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginator, 
    MatPaginatorModule
  ],
  templateUrl: './list-fournisseurs.component.html',
  styleUrl: './list-fournisseurs.component.scss'
})
export class ListFournisseursComponent implements OnInit,AfterViewInit{
    displayedColumns: string[] = ['position', 'nom', 'telephone', 'adresse'];
    dataSource = new MatTableDataSource<Fournisseur>();
    clickedRows = new Set<PeriodicElement>();
    filterForm: FormGroup;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    constructor(private fournisseurService: FournisseurService) {
      this.filterForm = new FormGroup({
        nom: new FormControl(''),
        telephone: new FormControl(''),
        adresse: new FormControl('')
      });
    }
  
  
    ngOnInit(): void {
      this.filterForm.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(() => {
        this.getFournisseurs();
      });
  
      this.getFournisseurs();
    }
  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
    getFournisseurs(): void {
      const filters = this.filterForm.value;
  
      this.fournisseurService.getFournisseursByFilter(filters).subscribe(
        (response: FournisseursPaged) => {
          this.dataSource.data = response.data;
        },
        (error) => {
          console.error('Error fetching clients', error);
        }
      );
    }
}
