import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FilterRailComponent } from "./filter-rail.component";

describe("FilterRailComponent", () => {
  let fixture: ComponentFixture<FilterRailComponent>;
  let component: FilterRailComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FilterRailComponent] }).compileComponents();
    fixture = TestBed.createComponent(FilterRailComponent);
    fixture.componentRef.setInput("state", { categories: [], priceMin: 0, priceMax: 5000 });
  });

  it("emits change when toggling a category", () => {
    const spy = jasmine.createSpy();
    component = fixture.componentInstance;
    component.change.subscribe(spy);
    fixture.detectChanges();
    component.toggleCategory("Bedroom");
    expect(spy).toHaveBeenCalledWith({ categories: ["Bedroom"], priceMin: 0, priceMax: 5000 });
  });
});
