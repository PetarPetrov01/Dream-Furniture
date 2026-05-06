import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './shared/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';

describe('AppComponent', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let storeMock: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getUserStorage',
      'clearUserSession',
    ]);
    storeMock = jasmine.createSpyObj('Store', ['select']);

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Store, useValue: storeMock },
      ],
    }).compileComponents();

    storeMock.select.and.returnValue(EMPTY);
    // authServiceMock.getUserStorage.and.returnValue(EMPTY);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'dreamFurniture' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('dreamFurniture');
  });
});
