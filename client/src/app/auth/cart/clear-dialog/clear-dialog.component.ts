import { Component, inject } from '@angular/core';

import {
  MatDialogClose,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';

import * as CartActions from '../cart.actions';

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
  private store = inject(Store);

  onConfirm() {
    this.store.dispatch(CartActions.resetState());
  }
}