import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { EyebrowComponent } from "../eyebrow/eyebrow.component";

@Component({
  selector: "app-section-heading",
  imports: [EyebrowComponent],
  templateUrl: "./section-heading.component.html",
  styleUrl: "./section-heading.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeadingComponent {
  eyebrow = input.required<string>();
  title = input.required<string>();
  align = input<"left" | "center">("left");
}
