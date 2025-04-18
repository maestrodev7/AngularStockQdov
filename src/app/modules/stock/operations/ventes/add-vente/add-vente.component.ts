import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientService } from 'app/modules/stock/services/clients/client.service';
import { ProduitService } from 'app/modules/stock/services/produits/produit.service';
import { VentesService } from 'app/modules/stock/services/Ventes/Ventes.service';
import { SnackbarErrorComponent } from 'app/modules/stock/shared/components/snackbar-error/snackbar-error.component';
import { SnackbarSuccessComponent } from 'app/modules/stock/shared/components/snackbar-success/snackbar-success.component';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-add-vente',
  templateUrl: './add-vente.component.html',
  styleUrls: ['./add-vente.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule
  ],
})
export class AddVenteComponent implements OnInit {
    venteForm!: FormGroup;
    errorMessage: string | null = null;

    clientOptions: any[] = [];
    productOptions: any[] = [];
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
        });

        // Fetch products to populate the dropdown list for each sale item
        this.produitService.getProduitsByFilter(null).subscribe(response => {
          this.productOptions = response.data;
        });
      }

      createItem(): FormGroup {
        return this.fb.group({
          product_id: [null, Validators.required],
          quantite: [null, [Validators.required, Validators.min(1)]],
          prix_vente: [null, [Validators.required, Validators.min(0)]]
        });
      }

      get items(): FormArray {
        return this.venteForm.get('items') as FormArray;
      }

      addItem(): void {
        this.items.push(this.createItem());
      }

      removeItem(index: number): void {
        if (this.items.length > 1) {
          this.items.removeAt(index);
        }
      }

      backToVentesList(): void {
        this.router.navigate(['/operations/ventes']);
      }

      onSubmit(): void {
        if (this.venteForm.valid) {
          const saleData = this.venteForm.value;
          this.venteService.createSale(saleData).pipe(
            tap(response => {
              this.venteForm.reset();
              this.errorMessage = null;
              this.showSnackBar('La vente a été ajoutée avec succès!', 'success');
              this.router.navigate(['/operations/ventes']);
            }),
            catchError(error => {
              this.showSnackBar('Erreur lors de l\'ajout de la vente.', 'error');
              return of(null);
            })
          ).subscribe();
        } else {
          this.showSnackBar('Veuillez remplir correctement les champs obligatoires.', 'error');
        }
      }

      // Display feedback via snack bar
      private showSnackBar(message: string, type: 'success' | 'error'): void {
        if (type === 'success') {
          this.snackBar.openFromComponent(SnackbarSuccessComponent, {
            duration: 5000,
            data: message
          });
        } else {
          this.snackBar.openFromComponent(SnackbarErrorComponent, {
            duration: 5000,
            data: message
          });
        }
      }

}
