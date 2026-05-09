import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  imports: [FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterComponent {
  email = '';
  submitted = signal(false);

  onSubmit() {
    if (!this.email.includes('@')) return;
    this.submitted.set(true);
    this.email = '';
  }
}
