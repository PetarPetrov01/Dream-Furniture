import { NgZone } from '@angular/core';
import { Router } from '@angular/router';

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { EMPTY, of, throwError } from 'rxjs';

import { AuthService } from '../../shared/auth.service';
import { RegisterComponent } from './register.component';
import { User } from '../../types/User';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    _id: '123',
    email: 'testemail@gmail.com',
    username: 'testUser',
    wishlist: [],
  };

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    authServiceMock.register.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email, username and password fields (required)', () => {
    const emailInput = fixture.debugElement.queryAll(
      By.css('input[name="email"]')
    )[0];
    const usernameInput = fixture.debugElement.query(
      By.css('input[name="username"]')
    );
    const passwordInput = fixture.debugElement.query(
      By.css('input[name="password"]')
    );

    emailInput.triggerEventHandler('blur');
    usernameInput.triggerEventHandler('blur');
    passwordInput.triggerEventHandler('blur');
    fixture.detectChanges();

    const emailErrors = fixture.debugElement.query(
      By.css('input[name="email"]~.errors')
    );
    const usernameErrors = fixture.debugElement.query(
      By.css('input[name="username"]~.errors')
    );
    const paswordErrors = fixture.debugElement.query(
      By.css('input[name="password"]~.errors')
    );

    expect(emailErrors.nativeElement.children[0].textContent).toContain(
      'Email is required!'
    );
    expect(usernameErrors.nativeElement.children[0].textContent).toContain(
      'Username is required'
    );
    expect(paswordErrors.nativeElement.children[0].textContent).toContain(
      'Password is required'
    );
  });

  it('should validate email', () => {
    const emailInput = fixture.debugElement.query(
      By.css('input[name="email"]')
    );

    emailInput.nativeElement.value = 'invalid@email';
    emailInput.triggerEventHandler('input', {
      target: emailInput.nativeElement,
    });
    emailInput.triggerEventHandler('blur');

    fixture.detectChanges();

    const emailErrors = fixture.debugElement.query(
      By.css('input[name="email"]~.errors')
    );
    expect(emailErrors.nativeElement.children[0].textContent).toContain(
      'Invalid email'
    );
  });

  it('should validate username length', () => {
    const usernameInput = fixture.debugElement.query(
      By.css('input[name="username"]')
    );

    usernameInput.nativeElement.value = 'sd';
    usernameInput.triggerEventHandler('input', {
      target: usernameInput.nativeElement,
    });
    usernameInput.triggerEventHandler('blur');

    fixture.detectChanges();

    const usernameErrors = fixture.debugElement.query(
      By.css('input[name="username"]~.errors')
    );

    expect(usernameErrors.nativeElement.children[0].textContent).toContain(
      'Username must be atleast 5 characters long!'
    );
  });

  it('should validate password length', () => {
    const passwordInput = fixture.debugElement.query(
      By.css('input[name="password"]')
    );

    passwordInput.nativeElement.value = '12';
    passwordInput.triggerEventHandler('input', {
      target: passwordInput.nativeElement,
    });
    passwordInput.triggerEventHandler('blur');

    fixture.detectChanges();

    const usernameErrors = fixture.debugElement.query(
      By.css('input[name="password"]~.errors')
    );

    expect(usernameErrors.nativeElement.children[0].textContent).toContain(
      'Password must be atleast 6 characters long'
    );
  });

  it('should validate matching passwords', () => {
    const passwordInput = fixture.debugElement.query(
      By.css('input[name="password"]')
    );
    const rePasswordInput = fixture.debugElement.query(
      By.css('input[name="rePassword"]')
    );

    passwordInput.triggerEventHandler('focus');
    rePasswordInput.triggerEventHandler('focus');

    passwordInput.nativeElement.value = '12';
    rePasswordInput.nativeElement.value = '00';

    passwordInput.triggerEventHandler('input', {
      target: passwordInput.nativeElement,
    });
    rePasswordInput.triggerEventHandler('input', {
      target: rePasswordInput.nativeElement,
    });

    passwordInput.triggerEventHandler('blur');
    rePasswordInput.triggerEventHandler('blur');

    fixture.detectChanges();

    const rePasswordError = fixture.debugElement.query(
      By.css('input[name="rePassword"]~.errors')
    );

    expect(rePasswordError.nativeElement.children[0].textContent).toContain(
      'Passwords do not match!'
    );
  });

  it('should not call authService when form is invalid ', async () => {
    component.handleRegister();
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('should toggle showpass', () => {
    expect(component.showPass).toBeFalse();
    component.toggleShowPass();
    expect(component.showPass).toBeTrue();
  });

  //Fill the form with valid data
  describe('Correctly filled form', () => {
    let ngZone: NgZone;
    let routerMock: Router;
    let emailInput;
    let usernameInput;
    let passwordInput;
    let rePasswordInput;
    let controlsArr;

    beforeEach(() => {
      ngZone = TestBed.inject(NgZone);
      routerMock = TestBed.inject(Router);
      spyOn(routerMock, 'navigate');

      emailInput = fixture.debugElement.queryAll(
        By.css('input[name="email"]')
      )[0];
      usernameInput = fixture.debugElement.query(
        By.css('input[name="username"]')
      );
      passwordInput = fixture.debugElement.query(
        By.css('input[name="password"]')
      );
      rePasswordInput = fixture.debugElement.query(
        By.css('input[name="rePassword"]')
      );

      emailInput.triggerEventHandler('focus');
      usernameInput.triggerEventHandler('focus');
      passwordInput.triggerEventHandler('focus');
      rePasswordInput.triggerEventHandler('focus');

      emailInput.nativeElement.value = mockUser.email;
      usernameInput.nativeElement.value = mockUser.username;
      passwordInput.nativeElement.value = '123456';
      rePasswordInput.nativeElement.value = '123456';

      controlsArr = [emailInput, usernameInput, passwordInput, rePasswordInput];

      controlsArr.forEach((input) => {
        input.triggerEventHandler('input', { target: input.nativeElement });
      });

      emailInput.triggerEventHandler('blur');
      usernameInput.triggerEventHandler('blur');
      passwordInput.triggerEventHandler('blur');
      rePasswordInput.triggerEventHandler('blur');

      fixture.detectChanges();
    });

    it('should call the service', async () => {
      ngZone.run(() => component.handleRegister());

      expect(component.isLoading).toBeTrue();
      expect(authServiceMock.register).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.username,
        '123456'
      );
    });

    it('should set timeout on error', fakeAsync(async () => {
      authServiceMock.register.and.returnValue(
        throwError(() => new Error('Error!'))
      );

      ngZone.run(() => component.handleRegister());

      expect(component.isLoading).toBeTrue();
      tick(2000);
      expect(component.isLoading).toBeFalse();
    }));

    it('should navigate and set isLoading to false', async () => {
      authServiceMock.register.and.returnValue(of(mockUser));

      ngZone.run(() => component.handleRegister());

      expect(component.isLoading).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });

    // Removed: 'should unsubscribe from the service'
    // The component no longer holds a manual Subscription field;
    // subscription teardown is handled by takeUntilDestroyed().
    // A replacement test would assert no further emissions land
    // after the component is destroyed.
  });
});
