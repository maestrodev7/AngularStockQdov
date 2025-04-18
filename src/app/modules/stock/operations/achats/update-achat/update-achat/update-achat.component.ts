import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AchatsService } from 'app/modules/stock/services/Achats/Achats.service';
import { FournisseurService } from 'app/modules/stock/services/fournisseurs/fournisseur.service';
import { ProduitService } from 'app/modules/stock/services/produits/produit.service';
import { SnackbarErrorComponent } from 'app/modules/stock/shared/components/snackbar-error/snackbar-error.component';
import { SnackbarSuccessComponent } from 'app/modules/stock/shared/components/snackbar-success/snackbar-success.component';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-update-achat',
  standalone: true,
  imports: [
      CommonModule,
      ReactiveFormsModule,
      MatInputModule,
      MatFormFieldModule,
      MatButtonModule,
      MatSelectModule
    ],
  templateUrl: './update-achat.component.html',
  styleUrl: './update-achat.component.scss'
})
export class UpdateAchatComponent implements OnInit{
  achatForm!: FormGroup;
  errorMessage: string | null = null;
  purchaseId!: string;
  supplierOptions: any[] = [];
  productOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private achatService: AchatsService,
    private fournisseurService: FournisseurService,
    private produitService: ProduitService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}


    ngOnInit(): void {
      this.achatForm = this.fb.group({
        supplier_id: [null, Validators.required],
        items: this.fb.array([this.createItem()])
      });

      this.purchaseId = this.route.snapshot.paramMap.get('id')!;

      this.achatService.getPurchaseById(this.purchaseId).subscribe(
        (response) => {
          const purchaseData = response.data;
          this.achatForm.patchValue({
            supplier_id: purchaseData.supplier_id
          });
          const itemsArray = this.achatForm.get('items') as FormArray;
          itemsArray.clear();
          itemsArray.push(
            this.fb.group({
              product_id: [purchaseData.product_id, Validators.required],
              quantite: [purchaseData.quantity, [Validators.required, Validators.min(1)]],
              prix_achat: [purchaseData.price, [Validators.required, Validators.min(0)]]
            })
          );
        },
        (error) => {
          this.showSnackBar("Erreur lors du chargement de la vente.", 'error');
        }
      );

      this.fournisseurService.getFournisseursByFilter(null).subscribe(response => {
        this.supplierOptions = response.data;
      });

      this.produitService.getProduitsByFilter(null).subscribe(response => {
        this.productOptions = response.data;
      });
    }
    get items(): FormArray {
        return this.achatForm.get('items') as FormArray;
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

    createItem(): FormGroup {
        return this.fb.group({
          product_id: [null, Validators.required],
          quantite: [null, [Validators.required, Validators.min(1)]],
          prix_achat: [null, [Validators.required, Validators.min(0)]]
        });
      }

      onSubmit(): void {
        if (this.achatForm.valid) {
          const saleData = this.achatForm.value;
          this.achatService.updatePurchase(saleData,this.purchaseId).pipe(
            tap(() => {
              this.errorMessage = null;
              this.showSnackBar('L`achat a été modifiée avec succès!', 'success');
              this.router.navigate(['/operations/achats']);
            }),
            catchError(error => {
              this.showSnackBar("Erreur lors de la modification de l'achat.", 'error');
              return of(null);
            })
          ).subscribe();
        } else {
          this.showSnackBar('Veuillez remplir correctement les champs obligatoires.', 'error');
        }
      }

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
