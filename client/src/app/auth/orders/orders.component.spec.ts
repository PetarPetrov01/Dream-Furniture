import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EMPTY, of } from 'rxjs';

import { OrdersComponent } from './orders.component';
import { AuthService } from '../../shared/auth.service';
import { APIOrder } from '../../types/Order';
import { APIProduct } from '../../types/Product';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  const mockProduct: APIProduct = {
    _id: '123',
    slug: 'mock-product',
    name: '',
    description: '',
    shortDescription: '',
    images: [''],
    category: [''],
    style: '',
    dimensions: { height: 1, width: 1, depth: 1 },
    material: [''],
    color: '',
    price: 1,
    isFeatured: false,
    inStock: true,
    tags: [],
    __v: '1',
    _ownerId: '111',
    createdAt: '123',
  };

  const mockOrder: APIOrder = {
    _id: '123',
    products: [{ _id: '123', product: mockProduct, count: 1 }],
    totalPrice: 10,
    createdAt: '123',
  };

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getOrders',
      'deleteOrder',
    ]);

    await TestBed.configureTestingModule({
      imports: [OrdersComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    authServiceMock.getOrders.and.returnValue(EMPTY);
    authServiceMock.deleteOrder.and.returnValue(of([]));

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOrders on init', () => {
    expect(authServiceMock.getOrders).toHaveBeenCalled();
  });

  it('should populate the orders signal from the service', () => {
    authServiceMock.getOrders.and.returnValue(of([mockOrder]));
    component.fetchOrders();
    expect(component.orders()).toEqual([mockOrder]);
  });

  it('should call deleteOrder and re-fetch on delete', () => {
    component.handleDelete('123');
    expect(authServiceMock.deleteOrder).toHaveBeenCalledWith('123');
    // fetchOrders is called from inside the deleteOrder subscribe
    expect(authServiceMock.getOrders).toHaveBeenCalled();
  });

  it('should clear the orders list after a successful delete', fakeAsync(() => {
    // Seed with one order
    authServiceMock.getOrders.and.returnValue(of([mockOrder]));
    component.fetchOrders();
    expect(component.orders().length).toBe(1);

    // Backend now returns an empty list after delete
    authServiceMock.getOrders.and.returnValue(of([]));
    component.handleDelete('123');
    tick();

    expect(component.orders().length).toBe(0);
  }));
});
