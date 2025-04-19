
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';

import { ProduitService } from 'app/modules/stock/services/produits/produit.service';
import { BoutiqueService } from 'app/modules/stock/services/boutiques/boutique.service';
import { Transfert } from 'app/modules/stock/interfaces/Transferts/Tranfert';
import { TransfertsService } from 'app/modules/stock/services/Transferts/Transferts.service';
import { TransfertFilter } from 'app/modules/stock/interfaces/Transferts/Transfert-filter';
import { MagazinService } from 'app/modules/stock/services/magazins/magazin.service';
import { Router } from '@angular/router';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list-transfert',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatIcon,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './list-transfert.component.html',
  styleUrls: ['./list-transfert.component.scss']
})
export class ListTransfertComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id', 'produitName', 'fromLocationName', 'toLocationName', 'quantity', 'createdAt'
  ];
  dataSource = new MatTableDataSource<Transfert>([]);
  filterForm: FormGroup;

  // Catalogs
  products: { id: number; nom: string }[] = [];
  magasins: { id: number; nom: string }[] = [];
  boutiques: { id: number; nom: string }[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private transfertsService: TransfertsService,
    private produitService: ProduitService,
    private magasinService: MagazinService,
    private boutiqueService: BoutiqueService,
    private router: Router
  ) {
    this.filterForm = new FormGroup({
      startDate: new FormControl(''),
      endDate:   new FormControl(''),
      fromType:  new FormControl(''),
      fromId:    new FormControl(''),
      toType:    new FormControl(''),
      toId:      new FormControl('')
    });
  }

  ngOnInit(): void {
    // Load catalogs then data
    forkJoin([
      this.produitService.getProduitsByFilter(null),
      this.magasinService.getMagazinByFilter(),
      this.boutiqueService.getShopByFilter()
    ]).subscribe(([prodResp, magResp, boutResp]: any) => {
      this.products = prodResp.data.map((p: any) => ({ id: p.id, nom: p.nom }));
      this.magasins = magResp.data.map((m: any) => ({ id: m.id, nom: m.nom }));
      this.boutiques = boutResp.data.map((b: any) => ({ id: b.id, nom: b.nom }));
      this.loadTransfers();
    });

    // React to filter changes
    this.filterForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => this.loadTransfers());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  goToAddTransfer(): void {
    this.router.navigate(['/operations/transferts/add-transfert']);
  }
  private formatDate(input: string|Date): string {
    const d = input instanceof Date ? input : new Date(input);
    // slice off the time portion
    return d.toISOString().substring(0, 10);
  }
  loadTransfers(): void {
    const raw = this.filterForm.value as TransfertFilter;
    console.log('raw', raw);

    const filter: TransfertFilter = {
        startDate: raw.startDate ? this.formatDate(raw.startDate) : undefined,
        endDate:   raw.endDate   ? this.formatDate(raw.endDate)   : undefined,
        fromType:  raw.fromType  || undefined,
        fromId:    raw.fromId    ? +raw.fromId : undefined,
        toType:    raw.toType    || undefined,
        toId:      raw.toId      ? +raw.toId : undefined
    };
    this.transfertsService.getTransfers(filter).subscribe({
        next: (response: any) => {
          const items: any[] = response.data || [];
          const transfers: Transfert[] = items.map(item => {
            const produit = this.products.find(p => p.id === item.produit_id);
            return {
              id:                item.id,
              produitId:         item.produit_id,
              fromLocationType:  item.from_location_type,
              fromLocationId:    item.from_location_id,
              toLocationType:    item.to_location_type,
              toLocationId:      item.to_location_id,
              quantity:          item.quantity,
              destinationId:     item.destination_id ?? null,
              createdAt:         item.created_at,
              updatedAt:         item.updated_at,
              produitName:       produit?.nom || '—',
              fromLocationName:  '',
              toLocationName:    ''
            } as Transfert;
          });



          // Resolve location names after initial map
          transfers.forEach(t => {
            if (t.fromLocationType === 'STORE') {
              t.fromLocationName = this.magasins.find(m => m.id === t.fromLocationId)?.nom || '—';
            } else {
              t.fromLocationName = this.boutiques.find(b => b.id === t.fromLocationId)?.nom || '—';
            }
            if (t.toLocationType === 'STORE') {
              t.toLocationName = this.magasins.find(m => m.id === t.toLocationId)?.nom || '—';
            } else {
              t.toLocationName = this.boutiques.find(b => b.id === t.toLocationId)?.nom || '—';
            }
          });

          this.dataSource.data = transfers;
        },
        error: err => console.error('Erreur chargement transferts', err)
      });
  }
}
