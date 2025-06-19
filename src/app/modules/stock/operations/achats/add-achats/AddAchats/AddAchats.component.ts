import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

import { AchatsService } from 'app/modules/stock/services/Achats/Achats.service';
import { FournisseurService } from 'app/modules/stock/services/fournisseurs/fournisseur.service';
import { ProduitService } from 'app/modules/stock/services/produits/produit.service';
import { SnackbarSuccessComponent } from 'app/modules/stock/shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from 'app/modules/stock/shared/components/snackbar-error/snackbar-error.component';

@Component({
  selector: 'app-AddAchats',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormField,
    MatLabel,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './AddAchats.component.html',
  styleUrls: ['./AddAchats.component.css']
})
export class AddAchatsComponent implements OnInit {
  achatsForm!: FormGroup;
  errorMessage: string | null = null;

  supplierOptions: any[] = [];
  productOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private achatsService: AchatsService,
    private fournisseurService: FournisseurService,
    private produitService: ProduitService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.achatsForm = this.fb.group({
      supplier_id: [null, Validators.required],
      items: this.fb.array([this.createItem()])
    });

    this.fournisseurService.getFournisseursByFilter(null).subscribe(response => {
      this.supplierOptions = response.data;
    });
    const filter = {};
    console.log("cdscs");

    this.produitService.getProduitsByFilter(filter).subscribe(response => {
        console.log('Produits:', response);

      this.productOptions = response.data.data;

    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      product_id: [null, Validators.required],
      quantite: [null, [Validators.required, Validators.min(1)]],
      prix_achat: [null, [Validators.required, Validators.min(0)]]
    });
  }

  get items(): FormArray {
    return this.achatsForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  backToAchatsList(): void {
    this.router.navigate(['/operations/achats']);
  }

  onSubmit(): void {
    if (this.achatsForm.valid) {
      const purchaseData = this.achatsForm.value;
      this.achatsService.addPurchase(purchaseData).pipe(
        tap(response => {
          this.achatsForm.reset();
          this.errorMessage = null;
          this.showSnackBar('L\'achat a été ajouté avec succès!', 'success');
          this.router.navigate(['operations/achats']);
        }),
        catchError(error => {
          this.showSnackBar('Erreur lors de l\'ajout de l\'achat.', 'error');
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
