import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ImageGalleryComponent } from "./image-gallery.component";

describe("ImageGalleryComponent", () => {
  let fixture: ComponentFixture<ImageGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ImageGalleryComponent] }).compileComponents();
    fixture = TestBed.createComponent(ImageGalleryComponent);
    fixture.componentRef.setInput("images", ["a.jpg", "b.jpg", "c.jpg"]);
    fixture.componentRef.setInput("alt", "Product");
  });

  it("renders the hero and grid images", () => {
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    const hero = html.querySelector(".hero img") as HTMLImageElement;
    expect(hero?.getAttribute("src")).toBe("a.jpg");
    expect(html.querySelectorAll(".grid img").length).toBe(2);
  });

  it("renders nothing when images is empty", () => {
    fixture.componentRef.setInput("images", []);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector(".hero")).toBeNull();
  });
});
