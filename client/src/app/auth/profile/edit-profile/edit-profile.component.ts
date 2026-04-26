import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { EmailValidateDirective } from '../../../shared/validators/email-validator.directive';

@Component({
    selector: 'app-edit-profile',
    imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    EmailValidateDirective
],
    templateUrl: './edit-profile.component.html',
    styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  constructor(private fb: FormBuilder, private authService: AuthService) {}

  editForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
  });

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.editForm.patchValue({
        username: user?.username,
        email: user?.email,
      });
    });
  }

  onConfirm() {
    if (this.editForm.invalid) {
      return;
    }

    const { username, email } = this.editForm.value;

    this.authService.editProfile(username!, email!);
  }
}
