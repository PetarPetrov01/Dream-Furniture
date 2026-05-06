import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import {} from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { AuthService } from '../../shared/auth.service';
import { EMPTY } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['select']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    mockStore.select.and.returnValue(EMPTY);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
