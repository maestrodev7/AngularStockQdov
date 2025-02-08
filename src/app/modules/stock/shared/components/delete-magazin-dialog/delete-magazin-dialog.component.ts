import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-magazin-dialog',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './delete-magazin-dialog.component.html',
  styleUrl: './delete-magazin-dialog.component.scss'
})
export class DeleteMagazinDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteMagazinDialogComponent>);

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
}
