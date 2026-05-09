import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, EMPTY } from 'rxjs';
import { HomeComponent } from './home.component';
import { ApiService } from '../../shared/api.service';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let apiServiceMock: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getProducts']);
    apiServiceMock.getProducts.and.returnValue(EMPTY);
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [{ provide: ApiService, useValue: apiServiceMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('creates and queries featured + arrivals on init', () => {
    apiServiceMock.getProducts.and.returnValue(of([]));
    fixture.detectChanges();
    expect(apiServiceMock.getProducts).toHaveBeenCalledWith({ isFeatured: 'true', limit: 3 });
    expect(apiServiceMock.getProducts).toHaveBeenCalledWith({ sort: 'createdAt:desc', limit: 8 });
  });

  it('flips loading flags off when data arrives', () => {
    apiServiceMock.getProducts.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component.featuredLoading()).toBeFalse();
    expect(component.arrivalsLoading()).toBeFalse();
  });
});
