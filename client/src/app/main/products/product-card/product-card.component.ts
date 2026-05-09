import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { APIProduct, PopulatedProduct } from "../../../types/Product";
import { FloorPricePipe } from "../../../shared/pipes/floor-price.pipe";
import { DecimalSlicePipe } from "../../../shared/pipes/decimal-slice.pipe";

export type CardDensity = "featured" | "default" | "rail";

@Component({
  selector: "app-product-card",
  imports: [RouterLink, FloorPricePipe, DecimalSlicePipe],
  templateUrl: "./product-card.component.html",
  styleUrl: "./product-card.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  product = input.required<APIProduct | PopulatedProduct>();
  density = input<CardDensity>("default");
}
