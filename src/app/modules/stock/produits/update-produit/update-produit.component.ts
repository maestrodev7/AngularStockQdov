import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../../services/produits/produit.service';
import { MagazinService } from '../../services/magazins/magazin.service';
import { BoutiqueService } from '../../services/boutiques/boutique.service';
import { CategoryService } from '../../services/category/category.service';
import { Produit } from '../../interfaces/produits/produit';
import { Magazin } from '../../interfaces/magazins/magazin';
import { Boutique } from '../../interfaces/boutiques/boutique';
import { Category } from '../../interfaces/category/category';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { magasinOrBoutiqueValidator } from '../../common/custom-valodators/magasin-boutique.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-update-produit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './update-produit.component.html',
  styleUrls: ['./update-produit.component.scss'],
})
export class UpdateProduitComponent implements OnInit {
  updateProduitForm!: FormGroup;
  magasins: Magazin[] = [];
  boutiques: Boutique[] = [];
  categories: Category[] = [];
  produitId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private magazinService: MagazinService,
    private boutiqueService: BoutiqueService,
    private categorieService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.updateProduitForm = this.fb.group({
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
      tailles: this.taillesFormArray()
    }, { validators: magasinOrBoutiqueValidator() });

    this.produitId = this.route.snapshot.paramMap.get('id');
    if (this.produitId) {
      this.loadProduitData(this.produitId);
    }

    this.loadMagasins();
    this.loadBoutiques();
    this.loadCategories();
  }

  taillesFormArray(): FormArray {
    return this.fb.array([]);
  }

  get tailles(): FormArray {
    return this.updateProduitForm.get('tailles') as FormArray;
  }

  loadProduitData(id: string) {
    this.produitService.getProduitById(id).pipe(
      tap(response => {
        if (response && response.status === 'success' && response.data) {
          const produitData = Array.isArray(response.data) ? response.data[0] : response.data;

          this.updateProduitForm.patchValue({
            ...produitData,
            locationType: produitData.magasin_id ? 'magasin' : 'boutique'
          });

          // Charger les tailles dans le FormArray
          if (produitData.tailles?.length) {
            const taillesControls = produitData.tailles.map((taille: any) =>
              this.fb.group({
                id: [taille.id],
                taille: [taille.taille, Validators.required],
                prix_achat: [taille.prix_achat, [Validators.required, Validators.min(0)]],
                prix_vente: [taille.prix_vente, [Validators.required, Validators.min(0)]],
                quantite: [taille.quantite, [Validators.required, Validators.min(0)]],
              })
            );
            const taillesArray = this.fb.array(taillesControls);
            this.updateProduitForm.setControl('tailles', taillesArray);
          }

        } else {
          this.showSnackBar('Produit introuvable', 'error');
          this.router.navigate(['/produits']);
        }
      }),
      catchError(error => {
        console.log(error);
        this.showSnackBar('Erreur de chargement des données', 'error');
        return of(null);
      })
    ).subscribe();
  }

  addTaille(): void {
    this.tailles.push(this.fb.group({
      taille: ['', Validators.required],
      prix_achat: [0, [Validators.required, Validators.min(0)]],
      prix_vente: [0, [Validators.required, Validators.min(0)]],
      quantite: [0, [Validators.required, Validators.min(0)]],
    }));
  }

  removeTaille(index: number): void {
    this.tailles.removeAt(index);
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
    if (this.updateProduitForm.valid) {
      const produitData: Produit = {
        ...this.updateProduitForm.value,
        from_magazin: this.updateProduitForm.get('locationType')?.value === 'magasin',
      };

      if (this.produitId) {
        this.produitService.updateProduit(produitData, this.produitId).pipe(
          tap(response => {
            this.updateProduitForm.reset();
            this.showSnackBar('Le produit a été modifié avec succès!', 'success');
            this.router.navigate(['/produits']);
          }),
          catchError(error => {
            this.showSnackBar(error.error || 'Erreur de modification du produit', 'error');
            return of(null);
          })
        ).subscribe();
      }
    } else {
      this.showSnackBar('Veuillez bien remplir les informations du formulaire.', 'error');
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
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

  backToProduitsList(): void {
    this.router.navigate(['/produits']);
  }
}
