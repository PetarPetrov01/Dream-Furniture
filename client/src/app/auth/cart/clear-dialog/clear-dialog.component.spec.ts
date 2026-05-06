import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearDialogComponent } from './clear-dialog.component';
import { CartStore } from '../cart.store';

describe('ClearDialogComponent', () => {
  let component: ClearDialogComponent;
  let fixture: ComponentFixture<ClearDialogComponent>;
  let cartStoreMock: jasmine.SpyObj<CartStore>;

  beforeEach(async () => {
    cartStoreMock = jasmine.createSpyObj('CartStore', ['reset']);

    await TestBed.configureTestingModule({
      imports: [ClearDialogComponent],
      providers: [{ provide: CartStore, useValue: cartStoreMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClearDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the cart store on confirm', () => {
    component.onConfirm();
    expect(cartStoreMock.reset).toHaveBeenCalled();
  });
});
