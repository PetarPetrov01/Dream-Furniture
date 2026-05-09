import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { PopulatedProduct } from "../../../types/Product";

@Component({
  selector: "app-spec-table",
  templateUrl: "./spec-table.component.html",
  styleUrl: "./spec-table.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecTableComponent {
  product = input.required<PopulatedProduct>();
}
