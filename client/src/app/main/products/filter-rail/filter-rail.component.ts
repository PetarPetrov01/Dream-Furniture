import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

export interface FilterState {
  categories: string[];
  priceMin: number;
  priceMax: number;
}

@Component({
  selector: "app-filter-rail",
  templateUrl: "./filter-rail.component.html",
  styleUrl: "./filter-rail.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterRailComponent {
  state = input.required<FilterState>();
  change = output<FilterState>();

  readonly allCategories = ["Living room", "Bedroom", "Dining room", "Home office", "Outdoor"];

  toggleCategory(cat: string) {
    const s = this.state();
    const next = s.categories.includes(cat)
      ? s.categories.filter((c) => c !== cat)
      : [...s.categories, cat];
    this.change.emit({ ...s, categories: next });
  }

  onPriceChange(min: number, max: number) {
    this.change.emit({ ...this.state(), priceMin: min, priceMax: max });
  }
}
