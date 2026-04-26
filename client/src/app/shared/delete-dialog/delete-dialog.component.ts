import { Component, OnDestroy, inject } from '@angular/core';

import { Subscription } from 'rxjs';

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
export class DeleteDialogComponent implements OnDestroy {
  dialogRef = inject<MatDialogRef<DeleteDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  private apiService = inject(ApiService);
  private router = inject(Router);

  subscription: Subscription | null = null;

  onConfirm() {
    this.subscription = this.apiService
      .deleteProduct(this.data._id)
      .subscribe();
      //subscribe is meaningless as delete request returns nothing

      this.router.navigate(['/products']);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
