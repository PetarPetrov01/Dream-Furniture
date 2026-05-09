import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SectionHeadingComponent } from "./section-heading.component";

describe("SectionHeadingComponent", () => {
  let fixture: ComponentFixture<SectionHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SectionHeadingComponent] }).compileComponents();
    fixture = TestBed.createComponent(SectionHeadingComponent);
    fixture.componentRef.setInput("eyebrow", "FEATURED");
    fixture.componentRef.setInput("title", "This season's pieces");
    fixture.detectChanges();
  });

  it("renders eyebrow and title", () => {
    const root = fixture.nativeElement;
    expect(root.querySelector(".eyebrow").textContent.trim()).toBe("FEATURED");
    expect(root.querySelector("h2").textContent.trim()).toBe("This season's pieces");
  });
});
