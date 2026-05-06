import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  MatDialogClose,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { CartStore } from '../cart.store';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveDialogComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);
  private cartStore = inject(CartStore);

  onConfirm() {
    this.cartStore.remove(this.data._id);
  }
}
