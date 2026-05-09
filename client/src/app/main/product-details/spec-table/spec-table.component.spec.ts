import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SpecTableComponent } from "./spec-table.component";
import { PopulatedProduct } from "../../../types/Product";

describe("SpecTableComponent", () => {
  let fixture: ComponentFixture<SpecTableComponent>;

  const product: PopulatedProduct = {
    _id: "1", slug: "halden", name: "Halden",
    description: "long", shortDescription: "short",
    images: [],
    category: ["Living room"], style: "Mid-century",
    dimensions: { height: 100, width: 200, depth: 50 },
    material: ["Wood", "Linen"], color: "brown", price: 100,
    tags: [], inStock: true, isFeatured: false,
    _ownerId: { _id: "u", email: "h@x", username: "house" } as any,
    __v: "0", createdAt: "",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SpecTableComponent] }).compileComponents();
    fixture = TestBed.createComponent(SpecTableComponent);
    fixture.componentRef.setInput("product", product);
  });

  it("renders six rows with the product fields", () => {
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    const rows = html.querySelectorAll(".spec > div");
    expect(rows.length).toBe(6);
    expect(html.textContent).toContain("Mid-century");
    expect(html.textContent).toContain("Wood, Linen");
    expect(html.textContent).toContain("200 mm");
  });
});
