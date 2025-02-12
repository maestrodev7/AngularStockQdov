import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-produit-dialog',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './delete-produit-dialog.component.html',
  styleUrl: './delete-produit-dialog.component.scss'
})
export class DeleteProduitDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteProduitDialogComponent>);

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
}
