import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  MatDialogRef,
  MatDialogClose,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { ApiService } from '../api.service';
import { Router } from '@angular/router';

export interface DialogData {
  productName: string;
  _id: string;
}

@Component({
    selector: 'delete-dialog',
    templateUrl: 'delete-dialog.component.html',
    styleUrl: 'delete-dialog.component.css',
    imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent]
})
export class DeleteDialogComponent {
  dialogRef = inject<MatDialogRef<DeleteDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  onConfirm() {
    this.apiService
      .deleteProduct(this.data._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.router.navigate(['/products']);
  }
}
