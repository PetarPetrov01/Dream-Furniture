import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../shared/auth.service';

import { MatchPasswordsDirective } from '../../shared/validators/match-passwords.directive';
import { EmailValidateDirective } from '../../shared/validators/email-validator.directive';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { AUTH_REDIRECT_DELAY_MS } from '../../shared/ui-constants';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    FormsModule,
    MatchPasswordsDirective,
    EmailValidateDirective,
    CommonModule,
    LoaderComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly registerForm = viewChild<NgForm>('registerForm');

  readonly isLoading = signal(false);
  readonly showPass = signal(false);

  handleRegister() {
    const registerForm = this.registerForm();
    if (registerForm == undefined || registerForm.invalid) {
      return;
    }
    const {
      email,
      username,
      passwords: { password },
    } = registerForm.value;

    registerForm.controls['passwords'].setValue({
      password: '',
      rePassword: '',
    });
    registerForm.controls['passwords'].markAsUntouched();

    this.isLoading.set(true);

    this.authService
      .register(email, username, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.isLoading.set(false);
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
