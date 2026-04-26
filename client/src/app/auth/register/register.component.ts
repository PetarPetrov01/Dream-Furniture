import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

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
export class RegisterComponent implements OnDestroy {
  @ViewChild('registerForm') registerForm: NgForm | undefined;
  subscription: Subscription | null;

  isLoading: boolean = false;
  showPass: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.subscription = null;
  }

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

    this.subscription = this.authService
      .register(email, username, password)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.isLoading = false;
        },
        error: (err) => {
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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
