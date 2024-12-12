import { Component, inject } from '@angular/core';
import { UserService } from './service/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mycart';
  auth = inject(UserService);
  constructor() {
    if (this.auth.access) {
      this.auth.setUser();
    }
  }
}
