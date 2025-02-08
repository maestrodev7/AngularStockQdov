import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Boutique } from '../../interfaces/boutiques/boutique';
import { Magazin } from '../../interfaces/magazins/magazin';
import { BoutiqueService } from '../../services/boutiques/boutique.service';
import { MagazinService } from '../../services/magazins/magazin.service';
import { MatDialog } from '@angular/material/dialog';
import { BoutiquesPaged } from '../../interfaces/boutiques/boutiques-paged';
import { MagazinsPaged } from '../../interfaces/magazins/magazins-paged';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap } from 'rxjs';
import { DeleteBoutiqueDialogComponent } from '../../shared/components/delete-boutique-dialog/delete-boutique-dialog.component';

@Component({
  selector: 'app-list-boutiques',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginator, 
    MatPaginatorModule
  ],
  templateUrl: './list-boutiques.component.html',
  styleUrl: './list-boutiques.component.scss'
})
export class ListBoutiquesComponent {
  displayedColumns: string[] = ['position', 'nom', 'telephone', 'adresse', 'magazinName', 'actions'];
  dataSource = new MatTableDataSource<Boutique>();
  filterForm: FormGroup;
  magazins: Magazin[] = [];

  constructor(
    private fb: FormBuilder,
    private boutiqueService: BoutiqueService,
    private magazinService: MagazinService, 
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      nom: [''],
      telephone: [''],
      adresse: [''],
    });
  }

  ngOnInit(): void {
    this.loadBoutiques();
    this.loadMagazins();  
  }

  loadBoutiques(): void {
    this.boutiqueService.getShopByFilter().subscribe((data: BoutiquesPaged) => {
      this.dataSource.data = data.data;
    });
  }

  loadMagazins(): void {
    this.magazinService.getMagazinByFilter().subscribe((data: MagazinsPaged) => {
      this.magazins = data.data;  
    });
  }

  getMagazinName(magazinId: number): string {
    const magazin = this.magazins.find(m => m.id === magazinId);
    return magazin ? magazin.nom : 'Unknown';  
  }

  applyFilter(): void {
    const filterValue = this.filterForm.value.nom.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  goToAddBoutique(): void {
    this.router.navigate(['/boutiques/add-boutique']);
  }

  updateBoutiqueById(boutiqueId: number): void {
    this.router.navigate(['/boutiques/update-boutique',boutiqueId]);
  }

  openDeleteDialog(magazinId:number){
      const dialogRef = this.dialog.open(DeleteBoutiqueDialogComponent, {
        width: '300px',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '300ms',
      });  
      dialogRef.afterClosed().pipe(
        filter(result => result), 
        switchMap(() => this.boutiqueService.deleteShop(magazinId)) 
      ).subscribe({
        next: () => {
          this.showSnackBar('boutique supprimé avec succes!', 'success');
          this.loadBoutiques(); 
        },
        error: (err) => {
          this.showSnackBar('Echec de suppresion de la boutique veillez reesayer', 'error');
        },
      });
    }
  
    private showSnackBar(message: string, type: 'success' | 'error'): void {
      const snackBarComponent = type === 'success' ? SnackbarSuccessComponent : SnackbarErrorComponent;
      this.snackBar.openFromComponent(snackBarComponent, {
        duration: 5000,
        data: message,
      });
    }
}
