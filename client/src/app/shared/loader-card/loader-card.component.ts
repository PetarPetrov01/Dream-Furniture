import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader-card',
  imports: [],
  templateUrl: './loader-card.component.html',
  styleUrl: './loader-card.component.css',
})
export class LoaderCardComponent {
  // OnPush is fine here but unnecessary — no inputs, no template state.
}
