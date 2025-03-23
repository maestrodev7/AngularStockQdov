import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, filter, forkJoin, map, of, switchMap } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchasesPaged } from 'app/modules/stock/interfaces/Achats/PurchasesPaged';
import { SnackbarSuccessComponent } from 'app/modules/stock/shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from 'app/modules/stock/shared/components/snackbar-error/snackbar-error.component';
import { Purchase } from 'app/modules/stock/interfaces/Achats/Purchase';
import { DeleteAchatsDialogComponent } from 'app/modules/stock/shared/components/delete-achat-dialog/DeleteAchatsDialog/DeleteAchatsDialog.component';
import { AchatsService } from 'app/modules/stock/services/Achats/Achats.service';
import { FournisseurService } from 'app/modules/stock/services/fournisseurs/fournisseur.service';
import { ProduitService } from 'app/modules/stock/services/produits/produit.service';

@Component({
  selector: 'app-list-achats',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './list-achats.component.html',
  styleUrls: ['./list-achats.component.scss']
})
export class ListAchatsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'supplier_name', 'product_name', 'quantity', 'price', 'total_price', 'actions'];
  dataSource = new MatTableDataSource<Purchase>();
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private achatsService: AchatsService,
    private router: Router,
    private dialog: MatDialog,
    private supplierService: FournisseurService,
    private productService: ProduitService,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = new FormGroup({
      supplier_name: new FormControl(''),
      product_name: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.getAchats();
    });

    this.getAchats();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getAchats(): void {
    const filters = this.filterForm.value;
    this.achatsService.getPurchasesByFilter(filters).pipe(
      switchMap((response: PurchasesPaged) => {
        const achats = response.data;
        const supplierIds = Array.from(new Set(achats.map(achat => achat.supplier_id)));
        const productIds = Array.from(new Set(achats.map(achat => achat.product_id)));
        return forkJoin({
          suppliers: forkJoin(
            supplierIds.map(id =>
              this.supplierService.getFourisseurById(id.toString()).pipe(
                map(supplierResponse => ({
                  id,
                  nom: (supplierResponse.data as any).nom
                }))
              )
            )
          ),
          products: forkJoin(
            productIds.map(id =>
              this.productService.getProduitById(id.toString()).pipe(
                map(productResponse => ({
                  id,
                  nom: (productResponse.data as any).nom
                }))
              )
            )
          ),
          achats: of(achats)
        });
      }),
      map(({ suppliers, products, achats }) => {
        const supplierMap = new Map<number, string>();
        suppliers.forEach(s => supplierMap.set(s.id, s.nom));

        const productMap = new Map<number, string>();
        products.forEach(p => productMap.set(p.id, p.nom));

        return achats.map(achat => ({
          ...achat,
          supplier_name: supplierMap.get(achat.supplier_id),
          product_name: productMap.get(achat.product_id)
        }));
      })
    ).subscribe(
      (achatsEnrichis: Purchase[]) => {
        this.dataSource.data = achatsEnrichis;
      },
      error => {
        console.error('Erreur lors de la récupération des achats', error);
      }
    );
  }


  goToAddAchat(): void {
    this.router.navigate(['/operations/achats/add-achats']);
  }

  openDeleteDialog(achatId: number): void {
    const dialogRef = this.dialog.open(DeleteAchatsDialogComponent, {
      width: '300px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '300ms',
    });
    dialogRef.afterClosed().pipe(
      filter(result => result),
      switchMap(() => this.achatsService.deletePurchase(achatId))
    ).subscribe({
      next: () => {
        this.showSnackBar('Achat supprimé avec succès!', 'success');
        this.getAchats();
      },
      error: () => {
        this.showSnackBar('Erreur lors de la suppression de l\'achat.', 'error');
      }
    });
  }

  updateAchatById(achatId: number): void {
    this.router.navigate(['/achats/update-achats', achatId]);
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    const snackBarComponent = type === 'success' ? SnackbarSuccessComponent : SnackbarErrorComponent;
    this.snackBar.openFromComponent(snackBarComponent, {
      duration: 5000,
      data: message,
    });
  }
}
