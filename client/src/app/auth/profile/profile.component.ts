import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../shared/auth.service';

import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

import { User } from '../../types/User';
import { APIProduct } from '../../types/Product';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  readonly user = signal<User | undefined>(undefined);
  readonly products = signal<APIProduct[]>([]);

  authService = inject(AuthService);
  matDialog = inject(MatDialog);
  router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.user.set(user);
      });
    this.authService
      .getOwnProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.products.set(products);
      });
  }

  onEditProfile() {
    this.matDialog.open(EditProfileComponent);
  }

  handleLogout() {
    this.authService.clearUserSession();
    this.router.navigate(['/']);
  }

  onDelete(
    product: APIProduct,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    this.matDialog.open(DeleteDialogComponent, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        productName: product?.name,
        _id: product?._id,
      },
    });
  }
}
