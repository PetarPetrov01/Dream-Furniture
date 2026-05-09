import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HairlineButtonComponent } from '../../../../shared/ui/hairline-button/hairline-button.component';

@Component({
  selector: 'app-hero',
  imports: [HairlineButtonComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  readonly heroImage = 'https://picsum.photos/seed/hero-luxury/2400/1600.jpg';
}
