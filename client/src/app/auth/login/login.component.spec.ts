import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { of } from 'rxjs';

import { AuthService } from '../../shared/auth.service';
import { NotificationService } from '../../shared/notification/notification.service';

import { LoginComponent } from './login.component';
import { HomeComponent } from '../../main/home/home.component';
import { User } from '../../types/User';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;

  let fb: jasmine.SpyObj<FormBuilder>;

  const mockUser: User = {
    _id: '123',
    email: 'testemail@gmail.com',
    username: 'testUser',
    wishlist: [],
  };

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    fb = jasmine.createSpyObj('FormBuilder', ['group']);
    notificationServiceMock = jasmine.createSpyObj('NotificationService', [
      'setNotification',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        RouterTestingModule.withRoutes([
          { path: '', component: HomeComponent },
        ]),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: FormBuilder, useValue: fb },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fb.group.and.returnValue(
      new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
      })
    );
    authServiceMock.login.and.returnValue(of(mockUser));

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create loginForm', () => {
    expect(component.loginForm).toBeTruthy();
  });

  it('loginForm should be invalid when empty', () => {
    expect(component.loginForm.invalid).toBeTrue();
    expect(component.loginForm.get('email')?.hasError('required')).toBeTrue();
    expect(component.loginForm.get('password')?.hasError('required')).toBeTrue();
  });

  it('should not send the request if the inputs are empty', () => {
    component.handleLoginSubmit();
    expect(component.isLoading()).toBeFalse();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call authService.login with the form values', () => {
    const ngZone = TestBed.inject(NgZone);

    component.loginForm.patchValue({
      email: 'testemail@gmail.com',
      password: '123456',
    });

    ngZone.run(() => component.handleLoginSubmit());

    expect(authServiceMock.login).toHaveBeenCalledWith(mockUser.email, '123456');
    expect(component.isLoading()).toBeFalse();
  });

  it('should set the notification with the username on success', () => {
    const ngZone = TestBed.inject(NgZone);

    component.loginForm.patchValue({
      email: 'testemail@gmail.com',
      password: '123456',
    });

    ngZone.run(() => component.handleLoginSubmit());

    expect(notificationServiceMock.setNotification).toHaveBeenCalledWith(
      `Successfully logged in as ${mockUser.username}`
    );
  });

  it('should navigate to home on successful login', () => {
    const ngZone = TestBed.inject(NgZone);
    const routerMock = TestBed.inject(Router);
    spyOn(routerMock, 'navigate');

    component.loginForm.patchValue({
      email: 'testemail@gmail.com',
      password: '123456',
    });

    ngZone.run(() => component.handleLoginSubmit());
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    expect(component.isLoading()).toBeFalse();
  });

  it('should toggle showPass', () => {
    expect(component.showPass()).toBeFalse();
    component.toggleShowPass();
    expect(component.showPass()).toBeTrue();
    component.toggleShowPass();
    expect(component.showPass()).toBeFalse();
  });
});
