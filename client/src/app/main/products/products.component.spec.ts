import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { BehaviorSubject, EMPTY, of } from "rxjs";
import { ProductsComponent } from "./products.component";
import { ApiService } from "../../shared/api.service";

describe("ProductsComponent", () => {
  let fixture: ComponentFixture<ProductsComponent>;
  let component: ProductsComponent;
  let api: jasmine.SpyObj<ApiService>;
  const queryParams$ = new BehaviorSubject({});

  beforeEach(async () => {
    api = jasmine.createSpyObj("ApiService", ["getProducts"]);
    api.getProducts.and.returnValue(EMPTY);
    await TestBed.configureTestingModule({
      imports: [ProductsComponent, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: ActivatedRoute, useValue: { queryParams: queryParams$.asObservable() } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  });

  it("queries products with paging on init", () => {
    api.getProducts.and.returnValue(of([]));
    fixture.detectChanges();
    queryParams$.next({});
    expect(api.getProducts).toHaveBeenCalledWith(jasmine.objectContaining({ limit: 12, offset: 0 }));
  });

  it("appends results when loadMore is invoked", () => {
    // Minimum shape ProductCardComponent reads: slug, name, price, images.
    const stub = (id: string) => ({
      _id: id,
      slug: `slug-${id}`,
      name: `Product ${id}`,
      price: 100,
      images: ["https://example.com/img.jpg"],
      category: ["Living room"],
      material: ["Wood"],
    }) as any;
    api.getProducts.and.returnValues(of([stub("a")]), of([stub("b")]));
    // BehaviorSubject already emits its initial value on subscribe via ngOnInit,
    // so detectChanges triggers the first fetch by itself.
    fixture.detectChanges();
    component.loadMore();
    expect(component.products().length).toBe(2);
  });
});
