import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-boutique-dialog',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './delete-boutique-dialog.component.html',
  styleUrl: './delete-boutique-dialog.component.scss'
})
export class DeleteBoutiqueDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteBoutiqueDialogComponent>);

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
}
