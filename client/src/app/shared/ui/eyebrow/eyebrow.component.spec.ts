import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EyebrowComponent } from "./eyebrow.component";

describe("EyebrowComponent", () => {
  let fixture: ComponentFixture<EyebrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EyebrowComponent] }).compileComponents();
    fixture = TestBed.createComponent(EyebrowComponent);
    fixture.componentRef.setInput("text", "FEATURED");
    fixture.detectChanges();
  });

  it("renders the text", () => {
    const el = fixture.nativeElement.querySelector(".eyebrow");
    expect(el.textContent.trim()).toBe("FEATURED");
  });
});
