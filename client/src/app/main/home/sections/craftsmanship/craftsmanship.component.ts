import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HairlineButtonComponent } from '../../../../shared/ui/hairline-button/hairline-button.component';
import { SectionHeadingComponent } from '../../../../shared/ui/section-heading/section-heading.component';

@Component({
  selector: 'app-craftsmanship',
  imports: [HairlineButtonComponent, SectionHeadingComponent],
  templateUrl: './craftsmanship.component.html',
  styleUrl: './craftsmanship.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CraftsmanshipComponent {
  readonly image = 'https://picsum.photos/seed/craft-detail/1400/1600.jpg';
}
