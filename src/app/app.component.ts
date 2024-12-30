import { Component, inject, OnInit } from '@angular/core';
import { UserService } from './service/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'mycart';
  auth = inject(UserService);
  ngOnInit(): void {
    if (this.auth.access) {
      this.auth.setUser();
    }
  }
}
