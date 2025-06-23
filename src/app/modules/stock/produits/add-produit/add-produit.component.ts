import { Component, OnInit, ViewChild } from '@angular/core';
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
import { forkJoin, map, Observable, of, startWith, take } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { CategoriesPaged } from '../../interfaces/category/categories-paged';

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
    MatAutocompleteModule
  ],
  templateUrl: './add-produit.component.html',
  styleUrls: ['./add-produit.component.scss'],
})
export class AddProduitComponent implements OnInit {
@ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;

  myForm: FormGroup;
  magasins: Magazin[] = [];
  boutiques: Boutique[] = [];
  categories: Category[] = [];
  filteredCategories$!: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private magazinSvc: MagazinService,
    private boutiqueSvc: BoutiqueService,
    private categorySvc: CategoryService,
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
    forkJoin({
      mags: this.magazinSvc.getMagazinByFilter().pipe(take(1)),
      bouts: this.boutiqueSvc.getShopByFilter().pipe(take(1)),
      cats: this.categorySvc.getAllCategories().pipe(take(1)),
    }).subscribe(({ mags, bouts, cats }) => {
      this.magasins   = mags.data;
      this.boutiques  = bouts.data;
      this.categories = cats.data;

      this.filteredCategories$ = this.myForm.get('categorie_id')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCategories(value))
      );
    });
  }
  private _filterCategories(value: string | number): Category[] {
    const filterValue = (typeof value === 'string' ? value : this._getNomById(value)).toLowerCase();
    return this.categories.filter(cat =>
      cat.nom.toLowerCase().includes(filterValue)
    );
  }

onCategorySelected(cat: Category): void {
  this.myForm.get('categorie_id')?.setValue(cat.id);
  this.autocomplete.closePanel();
}

displayCategorieFn = (categorie: number | string): string => {
  if (!categorie) return '';
  if (typeof categorie === 'string') return categorie;
  if (!this.categories || this.categories.length === 0) return '';
  const found = this.categories.find(c => c.id === categorie);
  return found ? found.nom : '';
};

  private _getNomById(id: number): string {
    const found = this.categories.find(c => c.id === id);
    return found ? found.nom : '';
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
        this.myForm.markAllAsTouched();
        return;
    }

    const rawCategorie = this.myForm.get('categorie_id')!.value;

    const processCategorie$: Observable<any> =
        typeof rawCategorie === 'number'
        ? new Observable(observer => {
            const existing = this.categories.find(c => c.id === rawCategorie);
            if (existing) {
                of(existing);
            } else {
                observer.error('Catégorie introuvable');
            }
            })
        : this.createCategoryIfNotExist(rawCategorie);

        processCategorie$.pipe(take(1)).subscribe({
            next: (response) => {
                const category = response.data;
                const payload: Produit = {
                    ...this.myForm.value,
                    categorie_id: category.id,
                    from_magazin: this.myForm.value.locationType === 'magasin',
                };

                const action$ = payload.from_magazin
                    ? this.produitService.addProduitToMagasin(payload)
                    : this.produitService.addProduitToBoutique(payload);

                action$.pipe(take(1)).subscribe(() => {
                    this.router.navigate(['/produits']);
                });
            },
            error: (err) => {
                console.error('Erreur lors de la gestion de la catégorie:', err);
            }
        });
    }


    backToProduitsList(): void {
        this.router.navigate(['/produits']);
    }

    private createCategoryIfNotExist(nom: string): Observable<any> {
        const existing = this.categories.find(c => c.nom.toLowerCase() === nom.toLowerCase());
        if (existing) {
            return of({
                status: 'success',
                message: 'Catégorie existante',
                data: existing
            });
        }

        return this.categorySvc.addCategory({ nom });
    }

}
