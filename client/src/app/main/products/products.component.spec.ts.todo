import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ApiService } from '../../shared/api.service';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { APIProduct } from '../../types/Product';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let routerMock: jasmine.SpyObj<Router>;
  let routeMock: jasmine.SpyObj<ActivatedRoute>;

  const queryParamsSubject = new BehaviorSubject({});
  const mockQueryParams = { sort: 'name:asc', category: 'Living room' };
  const mockProducts: APIProduct[] = [
    {
      _id: '123',
      name: '',
      description: '',
      image: '',
      category: [''],
      style: '',
      dimensions: {
        height: 1,
        width: 1,
        depth: 1,
      },
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
    routerMock = jasmine.createSpyObj('ApiService', ['navigate']);
    routeMock = jasmine.createSpyObj('ApiService', ['queryParams']);

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();
    routeMock.queryParams = queryParamsSubject.asObservable();
    apiServiceMock.getProducts.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    queryParamsSubject.next({});
    expect(component).toBeTruthy();

    expect(apiServiceMock.getProducts).toHaveBeenCalledWith({});
  });

  it('should call getProducts with queryParams on fetchProducts', () => {
    queryParamsSubject.next(mockQueryParams);

    component.fetchProducts();
    expect(apiServiceMock.getProducts).toHaveBeenCalledWith(mockQueryParams);
  });

  it('Should load the products',()=>{
    apiServiceMock.getProducts.and.returnValue(of(mockProducts));

    component.fetchProducts()

    expect(component.products).toEqual(mockProducts);
  });
});
