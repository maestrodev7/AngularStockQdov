import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of, map, startWith, take, tap, catchError } from 'rxjs';
import { ClientService } from 'app/modules/stock/services/clients/client.service';
import { ProduitService } from 'app/modules/stock/services/produits/produit.service';
import { VentesService } from 'app/modules/stock/services/Ventes/Ventes.service';
import { SnackbarErrorComponent } from 'app/modules/stock/shared/components/snackbar-error/snackbar-error.component';
import { SnackbarSuccessComponent } from 'app/modules/stock/shared/components/snackbar-success/snackbar-success.component';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-vente',
  templateUrl: './add-vente.component.html',
  styleUrls: ['./add-vente.component.css'],
    standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatButtonModule,
  ],
})
export class AddVenteComponent implements OnInit {
  venteForm!: FormGroup;
  clientOptions: any[] = [];
  productOptions: any[] = [];
  filteredClients$!: Observable<any[]>;
  filteredProducts$: Observable<any[]>[] = [];

  constructor(
    private fb: FormBuilder,
    private venteService: VentesService,
    private clientService: ClientService,
    private produitService: ProduitService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.venteForm = this.fb.group({
      client_id: [null, Validators.required],
      items: this.fb.array([this.createItem()])
    });

    this.clientService.getClientsByFilter(null).subscribe(response => {
      this.clientOptions = response.data;
      this.filteredClients$ = this.venteForm.get('client_id')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterClients(value))
      );
    });

    this.produitService.getProduitsByFilter({}).subscribe(response => {
      this.productOptions = response.data.data;
      this.initFilteredProducts(); // initialisation du filtre pour l’item 0
    });
  }

  get items(): FormArray {
    return this.venteForm.get('items') as FormArray;
  }

        backToVentesList(): void {
        this.router.navigate(['/operations/ventes']);
      }

  createItem(): FormGroup {
    const itemGroup = this.fb.group({
      product_id: [null, Validators.required],
      quantite: [null, [Validators.required, Validators.min(1)]],
      prix_vente: [null, [Validators.required, Validators.min(0)]]
    });

    return itemGroup;
  }

  addItem(): void {
    this.items.push(this.createItem());
    this.initFilteredProducts();
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.filteredProducts$.splice(index, 1);
    }
  }

  private initFilteredProducts(): void {
    const index = this.items.length - 1;
    const control = this.items.at(index).get('product_id');
    const filtered$ = control!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProducts(value))
    );
    this.filteredProducts$.push(filtered$);
  }

  private _filterClients(value: any): any[] {
    const filterValue = (typeof value === 'string' ? value : this._getClientNomById(value)).toLowerCase();
    return this.clientOptions.filter(client =>
      client.nom.toLowerCase().includes(filterValue)
    );
  }

  private _filterProducts(value: any): any[] {
    const val = typeof value === 'string' ? value : this._getProductNomById(value);
    return this.productOptions.filter(p =>
      p.nom.toLowerCase().includes(val.toLowerCase())
    );
  }

  private _getClientNomById(id: number): string {
    const found = this.clientOptions.find(c => c.id === id);
    return found ? found.nom : '';
  }

  private _getProductNomById(id: number): string {
    const found = this.productOptions.find(p => p.id === id);
    return found ? found.nom : '';
  }

  displayClientFn = (client: number | string): string => {
    if (!client) return '';
    if (typeof client === 'string') return client;
    const found = this.clientOptions.find(c => c.id === client);
    return found ? found.nom : '';
  };

  displayProductFn = (product: number | string): string => {
    if (!product) return '';
    if (typeof product === 'string') return product;
    const found = this.productOptions.find(p => p.id === product);
    return found ? found.nom : '';
  };

  onSubmit(): void {
    if (this.venteForm.invalid) {
      this.showSnackBar('Veuillez remplir correctement les champs obligatoires.', 'error');
      return;
    }

    const rawClient = this.venteForm.get('client_id')!.value;
    const processClient$ = typeof rawClient === 'number'
      ? of(this.clientOptions.find(c => c.id === rawClient))
      : this.createClientIfNotExist(rawClient);

    processClient$.pipe(take(1)).subscribe({
      next: (response) => {
        const client = response.data ?? response;
        this.venteForm.get('client_id')!.setValue(client.id);

        this.venteService.createSale(this.venteForm.value).pipe(
          tap(() => {
            this.venteForm.reset();
            this.showSnackBar('La vente a été ajoutée avec succès!', 'success');
            this.router.navigate(['/operations/ventes']);
          }),
          catchError(() => {
            this.showSnackBar('Erreur lors de l\'ajout de la vente.', 'error');
            return of(null);
          })
        ).subscribe();
      },
      error: () => {
        this.showSnackBar('Erreur lors de la création du client.', 'error');
      }
    });
  }

  private createClientIfNotExist(nom: string): Observable<any> {
    const existing = this.clientOptions.find(c => c.nom.toLowerCase() === nom.toLowerCase());
    return existing ? of({ status: 'success', data: existing }) : this.clientService.addClient({ nom });
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    const component = type === 'success' ? SnackbarSuccessComponent : SnackbarErrorComponent;
    this.snackBar.openFromComponent(component, {
      duration: 5000,
      data: message,
    });
  }
}
