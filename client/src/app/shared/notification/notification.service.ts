import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NOTIFICATION_TIMEOUT_MS } from '../ui-constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notification$$ = new BehaviorSubject<null | string>(null);
  notification$ = this.notification$$.asObservable();

  setNotification(notification: string) {
    this.notification$$.next(notification);

    setTimeout(() => {
      this.clearNotification();
    }, NOTIFICATION_TIMEOUT_MS);
  }

  clearNotification() {
    this.notification$$.next(null);
  }
}
