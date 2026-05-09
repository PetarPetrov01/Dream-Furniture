import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-hairline-button",
  imports: [RouterLink],
  templateUrl: "./hairline-button.component.html",
  styleUrl: "./hairline-button.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HairlineButtonComponent {
  label = input.required<string>();
  href = input<string | null>(null);
  arrow = input<boolean>(true);
}
