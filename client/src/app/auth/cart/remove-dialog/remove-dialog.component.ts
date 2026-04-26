import { Component, inject } from '@angular/core';

import {
  MatDialogClose,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';

import * as CartActions from '../cart.actions';

export interface DialogData {
  productName: string;
  _id: string;
}

@Component({
    selector: 'remove-dialog',
    templateUrl: 'remove-dialog.component.html',
    styleUrl: 'remove-dialog.component.css',
    imports: [
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
    ]
})
export class RemoveDialogComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);
  private store = inject(Store);

  onConfirm() {
    this.store.dispatch(CartActions.removeItem({ productId: this.data._id }));
  }
}
