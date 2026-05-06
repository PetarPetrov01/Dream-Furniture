import { Component, inject } from '@angular/core';

import {
  MatDialogClose,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { CartStore } from '../cart.store';

@Component({
    selector: 'app-clear-dialog',
    templateUrl: 'clear-dialog.component.html',
    styleUrl: 'clear-dialog.component.css',
    imports: [
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
    ]
})
export class ClearDialogComponent {
  private cartStore = inject(CartStore);

  onConfirm() {
    this.cartStore.reset();
  }
}
