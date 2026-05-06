import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { ApiService } from '../../shared/api.service';
import { APIProduct } from '../../types/Product';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;

  const mockProducts: APIProduct[] = [
    {
      _id: '123',
      name: '',
      description: '',
      image: '',
      category: [''],
      style: '',
      dimensions: { height: 1, width: 1, depth: 1 },
      material: [''],
      color: '',
      price: 1,
      __v: '1',
      _ownerId: '123',
      createdAt: '123',
    },
  ];

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getProducts']);
    apiServiceMock.getProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [{ provide: ApiService, useValue: apiServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    // Note: fixture.detectChanges() is called inside fakeAsync tests so
    // the setTimeout(2000) scheduled by ngOnInit is captured by the
    // virtual clock instead of the real one.
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call getProducts and populate the products signal after 2s', fakeAsync(() => {
    fixture.detectChanges(); // triggers ngOnInit
    tick(2000);
    expect(apiServiceMock.getProducts).toHaveBeenCalledWith({
      limit: 3,
      sort: 'createdAt:asc',
    });
    expect(component.products().length).toBeGreaterThan(0);
  }));

  it('should stop loading after the products arrive', fakeAsync(() => {
    fixture.detectChanges();
    tick(2000);
    expect(component.isLoading()).toBeFalse();
  }));
});
