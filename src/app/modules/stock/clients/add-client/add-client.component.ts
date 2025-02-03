import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/clients/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Client } from '../../interfaces/clients/client';
import { catchError, of, tap } from 'rxjs';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [CommonModule, MatInputModule,ReactiveFormsModule,MatFormField,MatLabel,MatButtonModule],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent {
  myForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
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

  basToclientsList(){
    this.router.navigate(['/clients']);
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      const client: Client = this.myForm.value; 
      this.clientService.addClient(client).pipe(
        tap(response => {
          this.myForm.reset();
          this.errorMessage = null;
          this.showSnackBar('Le client a été ajouté avec succès!', 'success');
          this.router.navigate(['/clients']);
        }),
        catchError(error => {
          this.showSnackBar('Erreur lors de l\'ajout du client.', 'error');
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
