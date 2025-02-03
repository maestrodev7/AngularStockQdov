import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/clients/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { Client } from '../../interfaces/clients/client';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-client',
  standalone: true,
  imports: [CommonModule, MatInputModule,ReactiveFormsModule,MatFormField,MatLabel,MatButtonModule],
  templateUrl: './update-client.component.html',
  styleUrl: './update-client.component.scss'
})
export class UpdateClientComponent {
  updateClientForm!: FormGroup;
  errorMessage: string | null = null;
  clientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private snackBar: MatSnackBar ,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.updateClientForm = this.fb.group({
      nom: ['', [Validators.required]],
      telephone: [''],
      adresse: [''],
      created_at: [''],
      updated_at: ['']
    });

    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.clientId) {
      this.loadClientData(this.clientId);
    }
  }
  
  loadClientData(id: string) {
    this.clientService.getClientById(id).pipe(
      tap(response => {
        if (response && response.status === 'success' && response.data) {
          console.log(response.data);
          
          this.updateClientForm.patchValue(response.data);
        } else {
          this.showSnackBar('Client introuvable', 'error');
          this.router.navigate(['/clients']);
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
    if (this.updateClientForm.valid) {
      const client: Client = { ...this.updateClientForm.value };
      this.clientService.updateClient(client, this.clientId).pipe(
        tap(response => {
          this.updateClientForm.reset(); 
          this.errorMessage = null; 
          this.showSnackBar('Le client a été modifié avec success!', 'success'); 
          this.router.navigate(['/clients']); 
        }),
        catchError(error => {
          this.showSnackBar(error.error || 'Erreur de modification du client', 'error'); 
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
