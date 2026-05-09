import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { APIProduct } from '../../../../types/Product';
import { ProductCardComponent } from '../../../products/product-card/product-card.component';
import { SectionHeadingComponent } from '../../../../shared/ui/section-heading/section-heading.component';
import { LoaderCardComponent } from '../../../../shared/loader-card/loader-card.component';

@Component({
  selector: 'app-new-arrivals',
  imports: [ProductCardComponent, SectionHeadingComponent, LoaderCardComponent],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewArrivalsComponent {
  products = input<APIProduct[]>([]);
  loading = input<boolean>(false);
  error = input<boolean>(false);
}
