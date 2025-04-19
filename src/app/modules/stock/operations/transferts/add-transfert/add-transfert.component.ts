// src/app/modules/stock/components/add-transfert/add-transfert.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProduitService } from 'app/modules/stock/services/produits/produit.service';
import { BoutiqueService } from 'app/modules/stock/services/boutiques/boutique.service';
import { TransfertsService } from 'app/modules/stock/services/Transferts/Transferts.service';
import { MagazinService } from 'app/modules/stock/services/magazins/magazin.service';

@Component({
  selector: 'app-add-transfert',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-transfert.component.html',
  styleUrls: ['./add-transfert.component.scss']
})
export class AddTransfertComponent implements OnInit {
  transfertForm: FormGroup;
  products: { id: number; nom: string }[] = [];
  magasins: { id: number; nom: string }[] = [];
  boutiques: { id: number; nom: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private transfertsService: TransfertsService,
    private produitService: ProduitService,
    private magasinService: MagazinService,
    private boutiqueService: BoutiqueService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.transfertForm = this.fb.group({
      product_id: ['', Validators.required],
      from_type:  ['STORE', Validators.required],
      from_id:    ['', Validators.required],
      to_type:    ['SHOP', Validators.required],
      to_id:      ['', Validators.required],
      quantity:   [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Load catalogs
    this.produitService.getProduitsByFilter(null).subscribe((resp: any) => {
      this.products = resp.data;
    });
    this.magasinService.getMagazinByFilter().subscribe((resp: any) => {
      this.magasins = resp.data;
    });
    this.boutiqueService.getShopByFilter().subscribe((resp: any) => {
      this.boutiques = resp.data;
    });
  }

  backToTransferList(): void {
    this.router.navigate(['/operations/transferts']);
  }

  onSubmit(): void {
    if (this.transfertForm.invalid) return;
    const payload = this.transfertForm.value;
    this.transfertsService.createTransfer(payload).subscribe({
      next: () => {
        this.snackBar.open('Transfert effectué avec succès', 'Close', { duration: 3000 });
        this.router.navigate(['/operations/transferts']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors du transfert', 'Close', { duration: 3000 });
      }
    });
  }
}
