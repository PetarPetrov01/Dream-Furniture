import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit {
  notification: null | string = null;

  notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.notificationService.notification$.subscribe((notification) => {
      this.notification = notification;
    });
  }

  clearNotification(){
    this.notificationService.clearNotification();
  }

}
