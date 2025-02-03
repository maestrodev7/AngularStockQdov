import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ClientService } from '../../services/clients/client.service';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Client } from '../../interfaces/clients/client';
import { ClientsPaged } from '../../interfaces/clients/clients-paged';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteClientDialogComponent } from '../../shared/components/delete-client-dialog/delete-client-dialog.component';
import { SnackbarSuccessComponent } from '../../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../../shared/components/snackbar-error/snackbar-error.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-list-clients',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginator, 
    MatPaginatorModule],
  templateUrl: './list-clients.component.html',
  styleUrl: './list-clients.component.scss'
})
export class ListClientsComponent implements OnInit,AfterViewInit{
  displayedColumns: string[] = ['position', 'nom', 'telephone', 'adresse', 'actions'];
  dataSource = new MatTableDataSource<Client>();
  clickedRows = new Set<PeriodicElement>();
  filterForm: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
      private clientService: ClientService,
      private router: Router,
      private dialog: MatDialog,
      private snackBar: MatSnackBar
    ) {
    this.filterForm = new FormGroup({
      nom: new FormControl(''),
      telephone: new FormControl(''),
      adresse: new FormControl('')
    });
  }

  goToAddClient(): void {
    this.router.navigate(['/clients/add-client']);
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.getClients();
    });

    this.getClients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getClients(): void {
    const filters = this.filterForm.value;

    this.clientService.getClientsByFilter(filters).subscribe(
      (response: ClientsPaged) => {
        this.dataSource.data = response.data;
      },
      (error) => {
        console.error('Error fetching clients', error);
      }
    );
  }

  openDeleteDialog(clientId:number){
    const dialogRef = this.dialog.open(DeleteClientDialogComponent, {
      width: '300px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '300ms',
    });  
    dialogRef.afterClosed().pipe(
      filter(result => result), 
      switchMap(() => this.clientService.deleteClient(clientId)) 
    ).subscribe({
      next: () => {
        this.showSnackBar('client supprimé avec succes!', 'success');
        this.getClients(); 
      },
      error: (err) => {
        this.showSnackBar('Failed to delete category. Please try again.', 'error');
      },
    });
}

  updateClientById(clientId: string): void {
    this.router.navigate(['/clients/update-client', clientId]);
  }

    private showSnackBar(message: string, type: 'success' | 'error'): void {
      const snackBarComponent = type === 'success' ? SnackbarSuccessComponent : SnackbarErrorComponent;
      this.snackBar.openFromComponent(snackBarComponent, {
        duration: 5000,
        data: message,
      });
    }
}
