import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-fournisseur-dialog',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './delete-fournisseur-dialog.component.html',
  styleUrl: './delete-fournisseur-dialog.component.scss'
})
export class DeleteFournisseurDialogComponent {
    readonly dialogRef = inject(MatDialogRef<DeleteFournisseurDialogComponent>);
  
    confirmDelete(): void {
      this.dialogRef.close(true);
    }
}
