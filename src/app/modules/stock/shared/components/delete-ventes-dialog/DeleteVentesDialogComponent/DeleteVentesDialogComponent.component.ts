import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-DeleteVentesDialogComponent',
  templateUrl: './DeleteVentesDialogComponent.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  styleUrls: ['./DeleteVentesDialogComponent.component.css']
})
export class DeleteVentesDialogComponentComponent  {
  readonly dialogRef = inject(MatDialogRef<DeleteVentesDialogComponentComponent>);

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
}
