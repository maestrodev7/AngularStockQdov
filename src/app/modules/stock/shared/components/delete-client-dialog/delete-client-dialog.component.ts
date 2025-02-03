import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-client-dialog',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './delete-client-dialog.component.html',
  styleUrl: './delete-client-dialog.component.scss'
})
export class DeleteClientDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteClientDialogComponent>);

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
}
