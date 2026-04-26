import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notification$$ = new BehaviorSubject<null | string>(null);
  notification$ = this.notification$$.asObservable();
 
  constructor() {}

  setNotification(notification: string) {
    this.notification$$.next(notification);

    setTimeout(() => {
      this.clearNotification()
    }, 4000);
  }

  clearNotification() {
    this.notification$$.next(null);
  }

}
