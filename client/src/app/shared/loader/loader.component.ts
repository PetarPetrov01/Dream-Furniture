import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  readonly color = input<string>('#fff');
  readonly diameter = input<string>('48px');
  readonly width = input<string>('5px');
  readonly type = input<('spinner' | 'dots')>('spinner');
}
