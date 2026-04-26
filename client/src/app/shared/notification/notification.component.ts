import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from './notification.service';

@Component({
    selector: 'app-notification',
    imports: [],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  notification: null | string = null;

  notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.notificationService.notification$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notification) => {
        this.notification = notification;
      });
  }

  clearNotification() {
    this.notificationService.clearNotification();
  }
}
