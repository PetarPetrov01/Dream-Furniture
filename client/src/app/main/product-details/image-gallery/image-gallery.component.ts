import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-image-gallery",
  templateUrl: "./image-gallery.component.html",
  styleUrl: "./image-gallery.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent {
  images = input.required<string[]>();
  alt = input.required<string>();

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.background = "var(--color-surface-muted)";
    img.removeAttribute("src");
  }
}
