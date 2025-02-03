import { Component } from '@angular/core';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';
import { Fournisseur } from '../../interfaces/fournisseurs/fournisseur';
import { catchError, of, tap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FournisseurService } from '../../services/fournisseurs/fournisseur.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-fournisseur',
  standalone: true,
  imports: [CommonModule, MatInputModule,ReactiveFormsModule,MatFormField,MatLabel,MatButtonModule],
  templateUrl: './add-fournisseur.component.html',
  styleUrl: './add-fournisseur.component.scss'
})
export class AddFournisseurComponent {
  myForm!: FormGroup;
    errorMessage: string | null = null;
  
    constructor(
      private fb: FormBuilder,
      private fournisseurService: FournisseurService,
      private snackBar: MatSnackBar,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      this.myForm = this.fb.group({
        nom: ['', [Validators.required]],
        telephone: [''],
        adresse: [''],
        created_at: [''],
        updated_at: ['']
      });
    }
  
    bacToFournisseurList(){
      this.router.navigate(['/fournisseurs']);
    }
  
    onSubmit(): void {
      if (this.myForm.valid) {
        const fournisseur: Fournisseur = this.myForm.value; 
        this.fournisseurService.addFournisseurs(fournisseur).pipe(
          tap(response => {
            this.myForm.reset();
            this.errorMessage = null;
            this.showSnackBar('Le fournisseur a été ajouté avec succès!', 'success');
            this.router.navigate(['/fournisseurs']);
          }),
          catchError(error => {
            this.showSnackBar('Erreur lors de l\'ajout du fournisseur.', 'error');
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
