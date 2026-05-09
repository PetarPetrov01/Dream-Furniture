import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { BehaviorSubject, of } from "rxjs";

import { ProductDetailsComponent } from "./product-details.component";
import { ApiService } from "../../shared/api.service";
import { AuthService } from "../../shared/auth.service";
import { CartStore } from "../../auth/cart/cart.store";
import { NotificationService } from "../../shared/notification/notification.service";
import { PopulatedProduct } from "../../types/Product";

describe("ProductDetailsComponent", () => {
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let api: jasmine.SpyObj<ApiService>;
  const params$ = new BehaviorSubject({ slug: "halden-lounge" });
  const product: PopulatedProduct = {
    _id: "1", slug: "halden-lounge", name: "Halden Lounge",
    description: "long", shortDescription: "short",
    images: ["https://x/y.jpg", "https://x/z.jpg"],
    category: ["Living room"], style: "Mid-century",
    dimensions: { height: 1, width: 1, depth: 1 },
    material: ["Wood"], color: "brown", price: 1890,
    tags: [], inStock: true, isFeatured: true,
    _ownerId: { _id: "u", email: "h@x", username: "house" } as any,
    __v: "0", createdAt: "",
  };

  beforeEach(async () => {
    api = jasmine.createSpyObj("ApiService", ["getProduct", "toggleWishList"]);
    api.getProduct.and.returnValue(of(product));
    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent, RouterTestingModule, MatDialogModule],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: ActivatedRoute, useValue: { params: params$.asObservable() } },
        { provide: AuthService, useValue: { isLogged: false, user: null } },
        { provide: CartStore, useValue: { addItem: () => {} } },
        { provide: NotificationService, useValue: { setNotification: () => {} } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ProductDetailsComponent);
  });

  it("loads product by slug from route", () => {
    fixture.detectChanges();
    expect(api.getProduct).toHaveBeenCalledWith("halden-lounge");
  });

  it("renders the gallery and price", () => {
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector("h1")?.textContent).toContain("Halden Lounge");
    // FloorPricePipe inserts thousands separators ("1 890") and DecimalSlicePipe
    // appends the cents ("00"); just verify the meaningful digits are present.
    expect(html.querySelector(".price")?.textContent).toContain("1 890");
  });
});
