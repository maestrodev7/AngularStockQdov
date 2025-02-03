import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { catchError, filter, switchMap, of, shareReplay, map, Observable } from 'rxjs';
import { CategoriesPaged } from '../interfaces/category/categories-paged';
import { CategoryService } from '../services/category/category.service';
import { Category } from '../interfaces/category/category';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCategoryDialogComponent } from '../shared/components/delete-category-dialog/delete-category-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarSuccessComponent } from '../shared/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '../shared/components/snackbar-error/snackbar-error.component';

@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FuseAlertComponent,
    MatSnackBarModule,
  ],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.scss',
})
export class CategorieComponent implements OnInit {
  categories$!: Observable<Category[]>;
  categoryForm: FormGroup;
  alertDismissed = true;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categories$ = this.categoryService.getAllCategories().pipe(
      map((pagedData: CategoriesPaged) => pagedData.data),
      shareReplay(1),
      catchError((err) => {
        console.error('Error fetching categories:', err);
        return of([]);
      })
    );
  }

  addCategory(): void {
    if (this.categoryForm.invalid) {
      this.showSnackBar('Please enter a valid category name!', 'error');
      return;
    }

    const newCategory = this.categoryForm.value;

    this.categoryService.addCategory(newCategory).subscribe({
      next: () => {
        this.showSnackBar('Category added successfully!', 'success');
        this.getAllCategories(); 
        this.categoryForm.reset(); 
      },
      error: (err) => {
        console.error('Error adding category:', err);
        this.showSnackBar('Failed to add category. Please try again.', 'error');
      },
    });
  }

  openDeleteDialog(categoryId: number): void {
    const dialogRef = this.dialog.open(DeleteCategoryDialogComponent, {
      width: '300px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '300ms',
    });  

    dialogRef.afterClosed().pipe(
      filter(result => result), 
      switchMap(() => this.categoryService.deleteCategory(categoryId)) 
    ).subscribe({
      next: () => {
        this.showSnackBar('Categorie supprimé avec succes!', 'success');
        this.getAllCategories(); 
      },
      error: (err) => {
        this.showSnackBar('Echec de suppression veillez ressayer.', 'error');
      },
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    const snackBarComponent = type === 'success' ? SnackbarSuccessComponent : SnackbarErrorComponent;
    this.snackBar.openFromComponent(snackBarComponent, {
      duration: 5000,
      data: message,
    });
  }
}
