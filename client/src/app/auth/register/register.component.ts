import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../shared/auth.service';

import { MatchPasswordsDirective } from '../../shared/validators/match-passwords.directive';
import { EmailValidateDirective } from '../../shared/validators/email-validator.directive';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@Component({
    selector: 'app-register',
    imports: [
        RouterLink,
        FormsModule,
        MatchPasswordsDirective,
        EmailValidateDirective,
        CommonModule,
        LoaderComponent,
        LazyLoadImageModule,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  @ViewChild('registerForm') registerForm: NgForm | undefined;

  isLoading: boolean = false;
  showPass: boolean = false;

  handleRegister() {
    if (this.registerForm == undefined || this.registerForm.invalid) {
      return;
    }
    const {
      email,
      username,
      passwords: { password },
    } = this.registerForm.value;

    this.registerForm.controls['passwords'].setValue({
      password: '',
      rePassword: '',
    });
    this.registerForm.controls['passwords'].markAsUntouched();

    this.isLoading = true;

    this.authService
      .register(email, username, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.isLoading = false;
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
