import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit {
  readonly notification = signal<string | null>(null);

  notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.notificationService.notification$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notification) => {
        this.notification.set(notification);
      });
  }

  clearNotification() {
    this.notificationService.clearNotification();
  }
}
