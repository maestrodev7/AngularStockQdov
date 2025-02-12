import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProduitService } from '../../services/produits/produit.service';
import { MagazinService } from '../../services/magazins/magazin.service';
import { BoutiqueService } from '../../services/boutiques/boutique.service';
import { Magazin } from '../../interfaces/magazins/magazin';
import { Boutique } from '../../interfaces/boutiques/boutique';
import { Produit } from '../../interfaces/produits/produit';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { magasinOrBoutiqueValidator } from '../../common/custom-valodators/magasin-boutique.validator';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../interfaces/category/category';

@Component({
  selector: 'app-add-produit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './add-produit.component.html',
  styleUrls: ['./add-produit.component.scss'],
})
export class AddProduitComponent implements OnInit {
  myForm: FormGroup;
  magasins: Magazin[] = [];
  boutiques: Boutique[] = [];
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private magazinService: MagazinService,
    private boutiqueService: BoutiqueService,
    private categorieService: CategoryService,
    private router: Router
  ) {
    this.myForm = this.fb.group({
      locationType: ['', Validators.required],
      nom: ['', Validators.required],
      description: [''],
      prix_achat: ['', [Validators.required, Validators.min(0)]],
      prix_vente: ['', [Validators.required, Validators.min(0)]],
      categorie_id: ['', Validators.required],
      date_peremption: [''],
      type: [''],
      quantite: ['', [Validators.required, Validators.min(0)]],
      magasin_id: [''],
      boutique_id: [''],
    },
    { validators: magasinOrBoutiqueValidator() });
  }

  ngOnInit(): void {
    this.loadMagasins();
    this.loadBoutiques();
    this.loadCategories();
  }

  loadMagasins(): void {
    this.magazinService.getMagazinByFilter().subscribe((data) => {
      this.magasins = data.data;
    });
  }

  loadBoutiques(): void {
    this.boutiqueService.getShopByFilter().subscribe((data) => {
      this.boutiques = data.data;
    });
  }

  loadCategories(): void {
    this.categorieService.getAllCategories().subscribe((data) => {
      this.categories = data.data;
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      const produitData: Produit = {
        ...this.myForm.value,
        from_magazin: this.myForm.get('locationType')?.value === 'magasin',
      };

      if (produitData.from_magazin) {
        this.produitService.addProduitToMagasin(produitData).subscribe((response) => {
          this.router.navigate(['/produits']);
        });
      } else {
        this.produitService.addProduitToBoutique(produitData).subscribe((response) => {
          this.router.navigate(['/produits']);
        });
      }
    }
  }

  backToProduitsList(): void {
    this.router.navigate(['/produits']);
  }
}