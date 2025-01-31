import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-success',
  standalone: true,
  imports: [],
  templateUrl: './snackbar-success.component.html',
  styleUrl: './snackbar-success.component.scss'
})
export class SnackbarSuccessComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: string,
    public snackBarRef: MatSnackBarRef<SnackbarSuccessComponent>
  ) {}
}
