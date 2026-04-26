import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../shared/auth.service';
import { EmailValidateDirective } from '../../shared/validators/email-validator.directive';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
    selector: 'app-login',
    imports: [
        RouterLink,
        ReactiveFormsModule,
        EmailValidateDirective,
        CommonModule,
        LoaderComponent,
        LazyLoadImageModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  isLoading: boolean = false;
  showPass: boolean = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  handleLoginSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    this.loginForm.reset();

    this.authService
      .login(email!, password!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.router.navigate(['/']);
          this.isLoading = false;
          this.notificationService.setNotification(
            `Successfully logged in as ${user.username}`
          );
        },
        error: () => {
          //mock delay to visualize loader
          setTimeout(() => {
            this.isLoading = false;
          }, 2000);
        },
      });
  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }
}
