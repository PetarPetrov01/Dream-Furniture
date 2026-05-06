import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { ClearDialogComponent } from './clear-dialog.component';

describe('ClearDialogComponent', () => {
  let component: ClearDialogComponent;
  let fixture: ComponentFixture<ClearDialogComponent>;
  let storeMock: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [ClearDialogComponent],
      providers: [
        {
          provide: Store,
          useValue: storeMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClearDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should dispatch store onConfirm',()=>{
    component.onConfirm()
    expect(storeMock.dispatch).toHaveBeenCalled();
  })
});
