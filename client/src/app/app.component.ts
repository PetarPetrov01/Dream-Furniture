import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { AuthComponent } from './auth/auth.component';
import { ErrorComponent } from './shared/error/error.component';
import { NotificationComponent } from './shared/notification/notification.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        AuthComponent,
        ErrorComponent,
        NotificationComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dreamFurniture';
  constructor() {}
}
