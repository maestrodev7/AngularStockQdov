import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FournisseurService } from '../../services/fournisseurs/fournisseur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { Fournisseur } from '../../interfaces/fournisseurs/fournisseur';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';

@Component({
  selector: 'app-update-founisseur',
  standalone: true,
  imports: [CommonModule, MatInputModule,ReactiveFormsModule,MatFormField,MatLabel,MatButtonModule],
  templateUrl: './update-founisseur.component.html',
  styleUrl: './update-founisseur.component.scss'
})
export class UpdateFounisseurComponent {
updateFournisseurForm!: FormGroup;
  errorMessage: string | null = null;
  fournisseurId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.updateFournisseurForm = this.fb.group({
      nom: ['', [Validators.required]],
      telephone: [''],
      adresse: [''],
      created_at: [''],
      updated_at: ['']
    });

    this.fournisseurId = this.route.snapshot.paramMap.get('id');
    if (this.fournisseurId) {
      this.loadFournisseurData(this.fournisseurId);
    }
  }
  
  loadFournisseurData(id: string) {
    this.fournisseurService.getFourisseurById(id).pipe(
      tap(response => {
        if (response && response.status === 'success' && response.data) {
          console.log(response.data);
          
          this.updateFournisseurForm.patchValue(response.data);
        } else {
          this.showSnackBar('Client introuvable', 'error');
          this.router.navigate(['/fournisseurs']);
        }
      }),
      catchError(error => {
        this.showSnackBar('Erreur de chargement des données', 'error');
        this.router.navigate(['/clients']);
        return of(null); 
      })
    ).subscribe();
  }
  

  onSubmit() {
    if (this.updateFournisseurForm.valid) {
      const client: Fournisseur = { ...this.updateFournisseurForm.value };
      this.fournisseurService.updateFournisseur(client, this.fournisseurId).pipe(
        tap(response => {
          this.updateFournisseurForm.reset(); 
          this.errorMessage = null; 
          this.showSnackBar('Le fourisseur a été modifié avec success!', 'success'); 
          this.router.navigate(['/fournisseurs']); 
        }),
        catchError(error => {
          this.showSnackBar(error.error || 'Erreur de modification du fournisseur', 'error'); 
          return of(null); 
        })
      ).subscribe();
    } else {
      this.showSnackBar('veillez bien remplir les information du formulaire.', 'error'); 
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
