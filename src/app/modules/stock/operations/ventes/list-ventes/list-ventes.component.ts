import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';

import { Sales } from 'app/modules/stock/interfaces/Ventes/Sales';
import { SalesPages } from 'app/modules/stock/interfaces/Ventes/Sales-pages';
import { SalesFilter } from 'app/modules/stock/interfaces/Ventes/Sales-filter';
import { VentesService } from 'app/modules/stock/services/Ventes/Ventes.service';
import { SnackbarSuccessComponent } from 'app/modules/stock/shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from 'app/modules/stock/shared/components/snackbar-error/snackbar-error.component';
import { DeleteVentesDialogComponentComponent } from 'app/modules/stock/shared/components/delete-ventes-dialog/DeleteVentesDialogComponent/DeleteVentesDialogComponent.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { ClientService } from 'app/modules/stock/services/clients/client.service';
import { ProduitService } from 'app/modules/stock/services/produits/produit.service';

@Component({
  selector: 'app-list-ventes',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatDatepickerModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatNativeDateModule
  ],
  templateUrl: './list-ventes.component.html',
  styleUrls: ['./list-ventes.component.scss']
})
export class ListVentesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'client_name', 'product_name', 'quantity', 'price', 'total_price', 'actions'];
  dataSource = new MatTableDataSource<Sales>([]);
  filterForm: FormGroup;

  // Vos tableaux clients et produits : notez que j'utilise "nom" ici, qui correspond à ce que vous obtenez depuis l'API
  clients: { id: number; nom: string }[] = [];
  products: { id: number; nom: string }[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private ventesService: VentesService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private clientService: ClientService,
    private produitService: ProduitService
  ) {
    this.filterForm = new FormGroup({
      start_date: new FormControl(''),
      end_date: new FormControl(''),
      client_id: new FormControl(''),
      product_id: new FormControl(''),
      min_total_price: new FormControl(''),
      max_total_price: new FormControl('')
    });
  }

  ngOnInit(): void {
    // Surveillez les changements du formulaire pour filtrer (vous pouvez laisser cette partie)
    this.filterForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.getSales();
    });

    // Utilisation de forkJoin pour charger clients et produits, puis récupérer les ventes
    forkJoin([
      this.clientService.getClientsByFilter(null),
      this.produitService.getProduitsByFilter(null)
    ]).subscribe({
      next: ([clientsResponse, produitsResponse]) => {

        this.clients = clientsResponse.data.map((client: any) => ({
          id: client.id,
          nom: client.nom
        }));
        this.products = produitsResponse.data.map((produit: any) => ({
          id: produit.id,
          nom: produit.nom
        }));
        this.getSales();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients/produits', error);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getSales(): void {
    const filters: SalesFilter = {
      start_date: this.filterForm.get('start_date')?.value,
      end_date: this.filterForm.get('end_date')?.value,
      client_id: this.filterForm.get('client_id')?.value,
      product_id: this.filterForm.get('product_id')?.value,
      min_total_price: this.filterForm.get('min_total_price')?.value,
      max_total_price: this.filterForm.get('max_total_price')?.value
    };

    this.ventesService.getSalesByFilter(filters).subscribe({
      next: (response: SalesPages) => {
        this.dataSource.data = response.data.map(sale => ({
          ...sale,
          client_name: this.clients.find(c => c.id === sale.client_id)?.nom || '',
          product_name: this.products.find(p => p.id === sale.product_id)?.nom || ''
        }));
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ventes', error);
      }
    });
  }

  goToAddSale(): void {
    this.router.navigate(['/operations/ventes/add-vente']);
  }

  updateSaleById(saleId: number): void {
    this.router.navigate(['/operations/ventes/update-vente', saleId]);
  }

  openDeleteDialog(saleId: number): void {
    const dialogRef = this.dialog.open(DeleteVentesDialogComponentComponent, {
      width: '300px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '300ms'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ventesService.deleteSale(saleId).subscribe({
          next: () => {
            this.showSnackBar('Vente supprimée avec succès!', 'success');
            this.getSales();
          },
          error: () => {
            this.showSnackBar('Erreur lors de la suppression de la vente.', 'error');
          }
        });
      }
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
