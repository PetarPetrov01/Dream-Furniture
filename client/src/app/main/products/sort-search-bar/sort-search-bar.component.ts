import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-sort-search-bar",
  imports: [FormsModule],
  templateUrl: "./sort-search-bar.component.html",
  styleUrl: "./sort-search-bar.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortSearchBarComponent {
  search = input<string>("");
  sort = input<string>("");
  showReset = input<boolean>(false);

  searchChange = output<string>();
  sortChange = output<string>();
  reset = output<void>();

  localSearch = "";
  localSort = "";

  sortOptions = [
    { value: "name:asc",       text: "Name (A → Z)" },
    { value: "name:desc",      text: "Name (Z → A)" },
    { value: "price:asc",      text: "Price ↑" },
    { value: "price:desc",     text: "Price ↓" },
    { value: "createdAt:asc",  text: "Oldest first" },
    { value: "createdAt:desc", text: "Newest first" },
  ];

  ngOnInit() { this.localSearch = this.search(); this.localSort = this.sort(); }

  submitSearch() { this.searchChange.emit(this.localSearch); }
  onSortChange() { this.sortChange.emit(this.localSort); }
  onReset() { this.reset.emit(); }
}
