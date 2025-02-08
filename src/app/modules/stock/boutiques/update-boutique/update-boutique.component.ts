import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BoutiqueService } from '../../services/boutiques/boutique.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { Boutique } from '../../interfaces/boutiques/boutique';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';
import { MagazinService } from '../../services/magazins/magazin.service';
import { Magazin } from '../../interfaces/magazins/magazin';

@Component({
  selector: 'app-update-boutique',
  standalone: true,
  imports: [CommonModule, MatInputModule, ReactiveFormsModule, MatFormField, MatLabel, MatButtonModule, MatSelectModule],
  templateUrl: './update-boutique.component.html',
  styleUrl: './update-boutique.component.scss'
})
export class UpdateBoutiqueComponent {
  updateBoutiqueForm!: FormGroup;
  errorMessage: string | null = null;
  boutiqueId: string | null = null;
  magazins: Magazin[] = [];

  constructor(
    private fb: FormBuilder,
    private boutiqueService: BoutiqueService,
    private magazinService: MagazinService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.updateBoutiqueForm = this.fb.group({
      nom: ['', [Validators.required]],
      telephone: [''],
      adresse: [''],
      magasin_id: ['', [Validators.required]],
      created_at: [''],
      updated_at: ['']
    });

    this.boutiqueId = this.route.snapshot.paramMap.get('id');
    if (this.boutiqueId) {
      this.loadBoutiqueData(this.boutiqueId);
    }

    this.loadMagazins();
  }

  loadBoutiqueData(id: string) {
    this.boutiqueService.getShopById(id).pipe(
      tap(response => {
        if (response && response.status === 'success' && response.data) {
          this.updateBoutiqueForm.patchValue(response.data);
        } else {
          this.showSnackBar('Boutique introuvable', 'error');
          this.router.navigate(['/boutiques']);
        }
      }),
      catchError(error => {
        this.showSnackBar('Erreur de chargement des données', 'error');
        this.router.navigate(['/boutiques']);
        return of(null);
      })
    ).subscribe();
  }

  loadMagazins() {
    this.magazinService.getMagazinByFilter().pipe(
      tap(response => {
        if (response && response.status === 'success' && response.data) {
          this.magazins = response.data;
        }
      }),
      catchError(error => {
        this.showSnackBar('Erreur de chargement des magasins', 'error');
        return of(null);
      })
    ).subscribe();
  }

  onSubmit() {
    if (this.updateBoutiqueForm.valid) {
      const boutique: Boutique = { ...this.updateBoutiqueForm.value };
      this.boutiqueService.updateShop(boutique, this.boutiqueId).pipe(
        tap(response => {
          this.updateBoutiqueForm.reset();
          this.errorMessage = null;
          this.showSnackBar('La boutique a été modifiée avec succès!', 'success');
          this.router.navigate(['/boutiques']);
        }),
        catchError(error => {
          this.showSnackBar(error.error || 'Erreur de modification de la boutique', 'error');
          return of(null);
        })
      ).subscribe();
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
}