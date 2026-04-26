import { Component, Inject, OnDestroy } from '@angular/core';

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
  subscription: Subscription | null = null;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apiService: ApiService,
    private router: Router
  ) {}

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
