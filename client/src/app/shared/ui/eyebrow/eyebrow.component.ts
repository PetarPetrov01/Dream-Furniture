import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-eyebrow",
  templateUrl: "./eyebrow.component.html",
  styleUrl: "./eyebrow.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EyebrowComponent {
  text = input.required<string>();
}
