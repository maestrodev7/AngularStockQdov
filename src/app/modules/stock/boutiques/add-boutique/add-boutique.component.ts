import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MagazinService } from '../../services/magazins/magazin.service';
import { BoutiqueService } from '../../services/boutiques/boutique.service';
import { Magazin } from '../../interfaces/magazins/magazin';
import { Boutique } from '../../interfaces/boutiques/boutique';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-boutique',
  standalone: true,
  imports: [CommonModule,MatSelectModule,MatInputModule,ReactiveFormsModule,MatFormField,MatLabel,MatButtonModule],
  templateUrl: './add-boutique.component.html',
  styleUrls: ['./add-boutique.component.scss']
})
export class AddBoutiqueComponent implements OnInit {
  myForm: FormGroup;
  magasins: Magazin[] = [];

  constructor(
    private fb: FormBuilder,
    private magazinService: MagazinService,
    private boutiqueService: BoutiqueService,
    private router: Router
  ) {
    this.myForm = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^(\+?\d{1,3}[- ]?)?\d{10}$/)]],
      magasin_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMagasins();
  }

  loadMagasins(): void {
    this.magazinService.getMagazinByFilter().subscribe((data) => {
      this.magasins = data.data;
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      const boutiqueData: Boutique = this.myForm.value;
      this.boutiqueService.addShop(boutiqueData).subscribe((response) => {
        this.router.navigate(['/boutiques']);
      });
    }
  }

  basToBoutiquesList(): void {
    this.router.navigate(['/boutiques']);
  }
}
