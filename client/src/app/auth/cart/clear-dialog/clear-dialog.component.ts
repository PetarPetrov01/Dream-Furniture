import { Component, Inject, OnDestroy } from '@angular/core';

import {
  MatDialogClose,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as CartActions from '../cart.actions'

@Component({
  selector: 'app-clear-dialog',
  templateUrl: 'clear-dialog.component.html',
  styleUrl: 'clear-dialog.component.css',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
})
export class ClearDialogComponent {
  subscription: Subscription | null = null;

  constructor(
    private store: Store
  ) {}

  onConfirm() {
   this.store.dispatch(CartActions.resetState());
  }
}