import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ClientService } from '../../services/clients/client.service';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Client } from '../../interfaces/clients/client';
import { ClientsPaged } from '../../interfaces/clients/clients-paged';

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
  displayedColumns: string[] = ['position', 'nom', 'telephone', 'adresse'];
  dataSource = new MatTableDataSource<Client>();
  clickedRows = new Set<PeriodicElement>();
  filterForm: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private clientService: ClientService) {
    this.filterForm = new FormGroup({
      nom: new FormControl(''),
      telephone: new FormControl(''),
      adresse: new FormControl('')
    });
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
}
