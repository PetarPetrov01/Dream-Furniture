import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { ProductCardComponent } from "./product-card.component";
import { APIProduct } from "../../../types/Product";

describe("ProductCardComponent", () => {
  let fixture: ComponentFixture<ProductCardComponent>;

  const product: APIProduct = {
    _id: "1",
    slug: "halden-lounge",
    name: "Halden Lounge",
    description: "",
    shortDescription: "",
    images: ["https://x/y.jpg"],
    category: ["Living room"],
    style: "Mid-century",
    dimensions: { height: 1, width: 1, depth: 1 },
    material: ["Wood"],
    color: "brown",
    price: 1890,
    tags: [],
    inStock: true,
    isFeatured: true,
    _ownerId: "u",
    __v: "0",
    createdAt: "",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput("product", product);
    fixture.detectChanges();
  });

  it("renders name and links to slug", () => {
    const a = fixture.nativeElement.querySelector("a.card");
    expect(a.getAttribute("href")).toBe("/products/halden-lounge");
    expect(fixture.nativeElement.querySelector(".name").textContent.trim()).toBe("Halden Lounge");
  });
});
