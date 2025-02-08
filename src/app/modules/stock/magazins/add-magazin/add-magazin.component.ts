import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MagazinService } from '../../services/magazins/magazin.service';
import { EntrepriseService } from '../../services/entreprises/entreprise.service';
import { Entreprise } from '../../interfaces/entreprises/entreprise';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-magazin',
  standalone: true,
  imports: [CommonModule,MatSelectModule,MatInputModule,ReactiveFormsModule,MatFormField,MatLabel,MatButtonModule],
  templateUrl: './add-magazin.component.html',
  styleUrls: ['./add-magazin.component.scss']
})
export class AddMagazinComponent implements OnInit {
  myForm: FormGroup;
  entreprises: Entreprise[] = [];

  constructor(
    private fb: FormBuilder,
    private magazinService: MagazinService,
    private entrepriseService: EntrepriseService,
    private router: Router
  ) {
    this.myForm = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^(\+?\d{1,3}[- ]?)?\d{10}$/)]],
      entreprise_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEntreprises();  
  }

  loadEntreprises(): void {
    this.entrepriseService.getEntrepriseByFilter().subscribe((data) => {
      this.entreprises = data.data;
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      const magazinData = this.myForm.value;
      this.magazinService.addMagazin(magazinData).subscribe((response) => {
        this.router.navigate(['/magazins']);
      });
    }
  }

  basToclientsList(): void {
    this.router.navigate(['/magazins']);
  }
}
