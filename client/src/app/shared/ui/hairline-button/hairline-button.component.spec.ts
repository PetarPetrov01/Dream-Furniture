import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { HairlineButtonComponent } from "./hairline-button.component";

describe("HairlineButtonComponent", () => {
  let fixture: ComponentFixture<HairlineButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairlineButtonComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it("renders an <a> with routerLink when href is set", () => {
    fixture = TestBed.createComponent(HairlineButtonComponent);
    fixture.componentRef.setInput("label", "Explore");
    fixture.componentRef.setInput("href", "/products");
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector("a.hairline-btn");
    expect(a).not.toBeNull();
    expect(a.getAttribute("href")).toBe("/products");
    expect(a.textContent).toContain("Explore");
    expect(fixture.nativeElement.querySelector("button.hairline-btn")).toBeNull();
  });

  it("renders a <button> when href is not set", () => {
    fixture = TestBed.createComponent(HairlineButtonComponent);
    fixture.componentRef.setInput("label", "Click");
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector("button.hairline-btn");
    expect(btn).not.toBeNull();
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.textContent).toContain("Click");
    expect(fixture.nativeElement.querySelector("a.hairline-btn")).toBeNull();
  });
});
