import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../shared/auth.service';
import { EmailValidateDirective } from '../../shared/validators/email-validator.directive';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { NotificationService } from '../../shared/notification/notification.service';
import { AUTH_REDIRECT_DELAY_MS } from '../../shared/ui-constants';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    EmailValidateDirective,
    CommonModule,
    LoaderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly showPass = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  handleLoginSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading.set(true);

    const { email, password } = this.loginForm.value;

    this.loginForm.reset();

    this.authService
      .login(email!, password!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.router.navigate(['/']);
          this.isLoading.set(false);
          this.notificationService.setNotification(
            `Successfully logged in as ${user.username}`
          );
        },
        error: () => {
          //mock delay to visualize loader
          setTimeout(() => {
            this.isLoading.set(false);
          }, AUTH_REDIRECT_DELAY_MS);
        },
      });
  }

  toggleShowPass() {
    this.showPass.update((v) => !v);
  }
}
