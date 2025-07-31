import { Component, OnInit } from '@angular/core';
import { Produit } from '../../interfaces/produits/produit';
import { ActivatedRoute } from '@angular/router';
import { ProduitService } from '../../services/produits/produit.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-produit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {

 produitId!: string;
  produit!: Produit;

  constructor(
    private route: ActivatedRoute,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    this.produitId = this.route.snapshot.paramMap.get('id')!;
    this.loadProduit();
  }

  loadProduit(): void {
    this.produitService.getProduitById(this.produitId).subscribe({
      next: (response) => {
        this.produit = response.data;
      },
      error: (err) => {
      }
    });
  }

}
