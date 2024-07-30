import { Component, inject, OnInit } from '@angular/core';
import { PreviousUrlService } from './service/previousUrl/previous-url.service';
import { initializeApp } from "firebase/app";
import { environment } from '../environments/environment.development';
import { UserService } from './service/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mycart';
  auth = inject(UserService);
  url = inject(PreviousUrlService);
  constructor() {
    this.auth.setUser();
  }
}
