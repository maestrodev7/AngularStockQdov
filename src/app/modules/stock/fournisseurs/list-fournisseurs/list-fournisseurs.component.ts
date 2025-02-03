import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Fournisseur } from '../../interfaces/fournisseurs/fournisseur';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PeriodicElement } from '../../clients/list-clients/list-clients.component';
import { FournisseurService } from '../../services/fournisseurs/fournisseur.service';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { FournisseursPaged } from '../../interfaces/fournisseurs/fournisseurs-paged';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';
import { DeleteFournisseurDialogComponent } from '../../shared/components/delete-fournisseur-dialog/delete-fournisseur-dialog.component';

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
    displayedColumns: string[] = ['position', 'nom', 'telephone', 'adresse','actions'];
    dataSource = new MatTableDataSource<Fournisseur>();
    clickedRows = new Set<PeriodicElement>();
    filterForm: FormGroup;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    constructor(
      private fournisseurService: FournisseurService,
      private router: Router,
      private dialog: MatDialog,
      private snackBar: MatSnackBar
    ) {
      this.filterForm = new FormGroup({
        nom: new FormControl(''),
        telephone: new FormControl(''),
        adresse: new FormControl('')
      });
    }
  
    goToAddSupplier(): void {
      this.router.navigate(['/fournisseurs/add-fournisseur']);
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

    updateFournisseurById(fournisseurId: string): void {
      this.router.navigate(['/fournisseurs/update-fournisseur', fournisseurId]);
    }

      openDeleteDialog(fournisseurId:number){
        const dialogRef = this.dialog.open(DeleteFournisseurDialogComponent, {
          width: '300px',
          enterAnimationDuration: '500ms',
          exitAnimationDuration: '300ms',
        });  
        dialogRef.afterClosed().pipe(
          filter(result => result), 
          switchMap(() => this.fournisseurService.deleteFournisseur(fournisseurId)) 
        ).subscribe({
          next: () => {
            this.showSnackBar('fournisseur supprimé avec succes!', 'success');
            this.getFournisseurs(); 
          },
          error: (err) => {
            this.showSnackBar('Failed to delete fournisseur. Please try again.', 'error');
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
