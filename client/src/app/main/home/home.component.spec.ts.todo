import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ApiService } from '../../shared/api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, of } from 'rxjs';
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

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [{ provide: ApiService, useValue: apiServiceMock }],
    }).compileComponents();

    apiServiceMock.getProducts
      .withArgs({ limit: 3, sort: 'createdAt:asc' })
      .and.returnValue(of(mockProducts));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should load the products', fakeAsync(async () => {
    await fixture.whenStable();

    expect(apiServiceMock.getProducts).toHaveBeenCalledWith({
      limit: 3,
      sort: 'createdAt:asc',
    });
    expect(component.products.length).toBeGreaterThan(0);
  }));

  it('Should stop loading', fakeAsync(async () => {
    await fixture.whenStable();

    expect(component.isLoading).toBeFalse();
  }));
});
