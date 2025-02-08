import { Component } from '@angular/core';
import { Magazin } from '../../interfaces/magazins/magazin';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Entreprise } from '../../interfaces/entreprises/entreprise';
import { MagazinService } from '../../services/magazins/magazin.service';
import { MatDialog } from '@angular/material/dialog';
import { EntreprisesPaged } from '../../interfaces/entreprises/entreprises-paged';
import { MagazinsPaged } from '../../interfaces/magazins/magazins-paged';
import { EntrepriseService } from '../../services/entreprises/entreprise.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DeleteMagazinDialogComponent } from '../../shared/components/delete-magazin-dialog/delete-magazin-dialog.component';
import { filter, switchMap } from 'rxjs';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-magazins',
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
  templateUrl: './list-magazins.component.html',
  styleUrl: './list-magazins.component.scss'
})
export class ListMagazinsComponent {
  displayedColumns: string[] = ['position', 'nom', 'telephone', 'adresse', 'companyName', 'actions'];
  dataSource = new MatTableDataSource<Magazin>();
  filterForm: FormGroup;
  entreprises: Entreprise[] = [];

  constructor(
    private fb: FormBuilder,
    private magazinService: MagazinService, 
    private entrepriseService: EntrepriseService,
    private snackBar: MatSnackBar,
    private router : Router,
    public dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      nom: [''],
      telephone: [''],
      adresse: [''],
    });
  }
  ngOnInit(): void {
    this.loadMagazins();
    this.loadEntreprises();  
  }
  loadMagazins(): void {
    this.magazinService.getMagazinByFilter().subscribe((data: MagazinsPaged) => {
      this.dataSource.data = data.data;
    });
  }

  loadEntreprises(): void {
    this.entrepriseService.getEntrepriseByFilter().subscribe((data: EntreprisesPaged) => {
      this.entreprises = data.data;
    });
  }

  getCompanyName(entrepriseId: number): string {
    const entreprise = this.entreprises.find(e => e.id === entrepriseId);
    return entreprise ? entreprise.nom : 'Unknown';  
  }

  applyFilter(): void {
    const filterValue = this.filterForm.value.nom.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  goToAddMagazin(): void {
    this.router.navigate(['/magazins/add-magazin']);
  }

  updateMagazinById(magazinId: number): void {
    this.router.navigate(['/magazins/update-magazin', magazinId]);
  }

  openDeleteDialog(magazinId:number){
    const dialogRef = this.dialog.open(DeleteMagazinDialogComponent, {
      width: '300px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '300ms',
    });  
    dialogRef.afterClosed().pipe(
      filter(result => result), 
      switchMap(() => this.magazinService.deleteMagazin(magazinId)) 
    ).subscribe({
      next: () => {
        this.showSnackBar('magazin supprimé avec succes!', 'success');
        this.loadMagazins(); 
      },
      error: (err) => {
        this.showSnackBar('Echec de suppresion du magazin veillez reesayer', 'error');
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
