import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MagazinService } from '../../services/magazins/magazin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { Magazin } from '../../interfaces/magazins/magazin';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';
import { EntrepriseService } from '../../services/entreprises/entreprise.service';
import { Entreprise } from '../../interfaces/entreprises/entreprise';

@Component({
  selector: 'app-update-magazin',
  standalone: true,
  imports: [CommonModule, MatInputModule, ReactiveFormsModule, MatFormField, MatLabel, MatButtonModule, MatSelectModule],
  templateUrl: './update-magazin.component.html',
  styleUrl: './update-magazin.component.scss'
})
export class UpdateMagazinComponent {
  updateMagazinForm!: FormGroup;
  errorMessage: string | null = null;
  magazinId: string | null = null;
  entreprises: Entreprise[] = [];

  constructor(
    private fb: FormBuilder,
    private magazinService: MagazinService,
    private entrepriseService: EntrepriseService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.updateMagazinForm = this.fb.group({
      nom: ['', [Validators.required]],
      telephone: [''],
      adresse: [''],
      entreprise_id: ['', [Validators.required]],
      created_at: [''],
      updated_at: ['']
    });

    this.magazinId = this.route.snapshot.paramMap.get('id');
    if (this.magazinId) {
      this.loadMagazinData(this.magazinId);
    }

    this.loadEntreprises();
  }

  loadMagazinData(id: string) {
    this.magazinService.getMagazinById(id).pipe(
      tap(response => {
        if (response && response.status === 'success' && response.data) {
          this.updateMagazinForm.patchValue(response.data);
        } else {
          this.showSnackBar('Magasin introuvable', 'error');
          this.router.navigate(['/magazins']);
        }
      }),
      catchError(error => {
        this.showSnackBar('Erreur de chargement des données', 'error');
        this.router.navigate(['/magazins']);
        return of(null);
      })
    ).subscribe();
  }

  loadEntreprises() {
    this.entrepriseService.getEntrepriseByFilter().pipe(
      tap(response => {
        if (response && response.status === 'success' && response.data) {
          this.entreprises = response.data;
        }
      }),
      catchError(error => {
        this.showSnackBar('Erreur de chargement des entreprises', 'error');
        return of(null);
      })
    ).subscribe();
  }

  onSubmit() {
    if (this.updateMagazinForm.valid) {
      const magazin: Magazin = { ...this.updateMagazinForm.value };
      this.magazinService.updateMagazin(magazin, this.magazinId).pipe(
        tap(response => {
          this.updateMagazinForm.reset();
          this.errorMessage = null;
          this.showSnackBar('Le magasin a été modifié avec succès!', 'success');
          this.router.navigate(['/magazins']);
        }),
        catchError(error => {
          this.showSnackBar(error.error || 'Erreur de modification du magasin', 'error');
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