import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-achats-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './DeleteAchatsDialog.component.html',
  styleUrls: ['./DeleteAchatsDialog.component.css']
})
export class DeleteAchatsDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteAchatsDialogComponent>);

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
}
