import { Component } from '@angular/core';
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DeleteProduitDialogComponent } from '../../shared/components/delete-produit-dialog/delete-produit-dialog.component';
import { filter, switchMap } from 'rxjs';
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
export class ListProduitsComponent {
  displayedColumns: string[] = [
    'position',
    'nom',
    'description',
    'prix_achat',
    'prix_vente',
    'quantite',
    'categorie', 
    'actions',
  ];
  dataSource = new MatTableDataSource<Produit>();
  filterForm: FormGroup;
  categories: Category[] = []; 
  magazins: Magazin[] = []; 
  boutiques: Boutique[] = []; 

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
      type: ['magasin'], 
      magasin_id: [''], 
      boutique_id: [''], 
      nom: [''],
      categorie_id: [''],
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.loadProduits();
    });
  }

  ngOnInit(): void {
    this.loadCategories(); 
    this.loadMagazins(); 
    this.loadBoutiques(); 
    this.loadProduits(); 
  }

  loadProduits(): void {
    const type = this.filterForm.get('type')?.value;
    const magasin_id = this.filterForm.get('magasin_id')?.value;
    const boutique_id = this.filterForm.get('boutique_id')?.value;
    const nom = this.filterForm.get('nom')?.value;
    const categorie_id = this.filterForm.get('categorie_id')?.value;

    if (type === 'magasin' && magasin_id) {
      this.produitService.getProduitsByMagasin(magasin_id).subscribe((data: ProduitsPaged) => {
        this.dataSource.data = this.applyFilters(data.data, nom, categorie_id);
      });
    } else if (type === 'boutique' && boutique_id) {
      this.produitService.getProduitsByBoutique(boutique_id).subscribe((data: ProduitsPaged) => {
        this.dataSource.data = this.applyFilters(data.data, nom, categorie_id);
      });
    } else {
      this.dataSource.data = [];
    }
  }

  loadCategories(): void {
    this.categorieService.getAllCategories().subscribe((data) => {
      this.categories = data.data;
    });
  }

  loadMagazins(): void {
    this.magazinService.getMagazinByFilter().subscribe((data) => {
      this.magazins = data.data; 
    });
  }

  loadBoutiques(): void {
    this.boutiqueService.getShopByFilter().subscribe((data) => {
      this.boutiques = data.data; 
    });
  }

  getCategorieName(categorieId: number): string {
    const categorie = this.categories.find((c) => c.id === categorieId);
    return categorie ? categorie.nom : 'Inconnue'; 
  }

  applyFilters(data: Produit[], nom: string, categorie_id: string): Produit[] {
    return data.filter((produit) => {
      const matchesNom = produit.nom.toLowerCase().includes(nom.toLowerCase());
      const matchesCategorie = categorie_id
        ? produit.categorie_id.toString() === categorie_id.toString()
        : true;
      return matchesNom && matchesCategorie;
    });
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
      filter((result) => result),
      switchMap(() => this.produitService.deleteProduit(produitId))
    ).subscribe({
      next: () => {
        this.showSnackBar('Produit supprimé avec succès !', 'success');
        this.loadProduits(); 
      },
      error: (err) => {
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
}