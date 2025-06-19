import { Component, OnInit } from '@angular/core';
import { Produit } from '../../interfaces/produits/produit';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProduitService } from '../../services/produits/produit.service';
import { MatDialog } from '@angular/material/dialog';
import { ProduitsPaged } from '../../interfaces/produits/produits-paged';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DeleteProduitDialogComponent } from '../../shared/components/delete-produit-dialog/delete-produit-dialog.component';
import { debounceTime, filter, forkJoin, skip, switchMap, take, tap } from 'rxjs';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MagazinService } from '../../services/magazins/magazin.service';
import { BoutiqueService } from '../../services/boutiques/boutique.service';
import { Magazin } from '../../interfaces/magazins/magazin';
import { Boutique } from '../../interfaces/boutiques/boutique';
import { Category } from '../../interfaces/category/category';
import { CategoryService } from '../../services/category/category.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-produits',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
  ],
  templateUrl: './list-produits.component.html',
  styleUrl: './list-produits.component.scss',
})
export class ListProduitsComponent implements OnInit {
  displayedColumns: string[] = [
    'position', 'nom', 'description', 'prix_achat', 'prix_vente', 'quantite', 'categorie', 'actions',
  ];
  dataSource = new MatTableDataSource<Produit>();
  filterForm: FormGroup;
  categories: Category[] = [];
  magazins: Magazin[] = [];
  boutiques: Boutique[] = [];
  pageSize = 25;
  currentPage = 1;
  totalItems = 0;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private categorieService: CategoryService,
    private magazinService: MagazinService,
    private boutiqueService: BoutiqueService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      type: [''],
      magasin_id: [''],
      boutique_id: [''],
      nom: [''],
      categorie_id: [''],
    });
  }

  ngOnInit(): void {
    forkJoin({
        categories: this.categorieService.getAllCategories(),
        magazins: this.magazinService.getMagazinByFilter(),
        boutiques: this.boutiqueService.getShopByFilter()
    })
      .pipe(tap(() => this.loadProduits()))
      .subscribe(({ categories, magazins, boutiques }) => {
        this.categories = categories.data;
        this.magazins   = magazins.data;
        this.boutiques  = boutiques.data;
      });

    this.filterForm.valueChanges.pipe(
      skip(1),
      debounceTime(500)
    ).subscribe(() => this.loadProduits());
  }


  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadProduits();
  }

  loadProduits(): void {
    const filters = this.filterForm.value;
    const params = {
      nom: filters.nom,
      categorie_id: filters.categorie_id,
      per_page: this.pageSize,
      page: this.currentPage
    };

    if (filters.type === 'magasin' && filters.magasin_id) {
      this.produitService.getProduitsByMagasin(filters.magasin_id, params)
        .subscribe((data: ProduitsPaged) => {
          this.dataSource.data = data.data.data;
          this.totalItems = data.data.meta.total;
          this.pageSize = data.data.meta.per_page;
          this.currentPage = data.data.meta.current_page;
        });
    } else if (filters.type === 'boutique' && filters.boutique_id) {
      this.produitService.getProduitsByBoutique(filters.boutique_id, params)
        .subscribe((data: ProduitsPaged) => {
          this.dataSource.data = data.data.data;
          this.totalItems = data.data.meta.total;
          this.pageSize = data.data.meta.per_page;
          this.currentPage = data.data.meta.current_page;
        });
    } else {
      this.produitService.getProduitsByFilter(params)
        .subscribe((data: ProduitsPaged) => {
          this.dataSource.data = data.data.data;
          this.totalItems = data.data.meta.total;
          this.pageSize = data.data.meta.per_page;
          this.currentPage = data.data.meta.current_page;
        });
    }
  }

  goToAddProduit(): void {
    this.router.navigate(['/produits/add-produit']);
  }

  updateProduitById(produitId: number): void {
    this.router.navigate(['/produits/update-produit', produitId]);
  }

  openDeleteDialog(produitId: number): void {
    const dialogRef = this.dialog.open(DeleteProduitDialogComponent, {
      width: '300px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '300ms',
    });

    dialogRef.afterClosed().pipe(
      filter(result => result),
      switchMap(() => this.produitService.deleteProduit(produitId))
    ).subscribe({
      next: () => {
        this.showSnackBar('Produit supprimé avec succès !', 'success');
        this.loadProduits();
      },
      error: () => {
        this.showSnackBar('Échec de la suppression du produit. Veuillez réessayer.', 'error');
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

  trackById(index: number, item: Produit): number {
    return item.id;
  }
}
