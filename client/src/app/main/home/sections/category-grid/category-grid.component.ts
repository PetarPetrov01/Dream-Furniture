import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHeadingComponent } from '../../../../shared/ui/section-heading/section-heading.component';

interface Tile { name: string; image: string; query: string; }

@Component({
  selector: 'app-category-grid',
  imports: [RouterLink, SectionHeadingComponent],
  templateUrl: './category-grid.component.html',
  styleUrl: './category-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryGridComponent {
  tiles: Tile[] = [
    { name: 'Living room', image: 'https://picsum.photos/seed/cat-living/900/1200.jpg', query: 'Living room' },
    { name: 'Bedroom',     image: 'https://picsum.photos/seed/cat-bedroom/900/1200.jpg', query: 'Bedroom' },
    { name: 'Dining room', image: 'https://picsum.photos/seed/cat-dining/900/1200.jpg',  query: 'Dining room' },
    { name: 'Home office', image: 'https://picsum.photos/seed/cat-office/900/1200.jpg',  query: 'Home office' },
    { name: 'Outdoor',     image: 'https://picsum.photos/seed/cat-outdoor/900/1200.jpg', query: 'Outdoor' },
  ];
}
