import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user/user.service';
import { Router } from '@angular/router';
import { PreviousUrlService } from '../../service/previousUrl/previous-url.service';
import { UserProfileService } from '../../service/profile/user-profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor() {
    this.auth.user$.subscribe({
      next:(data) => {
        if(data != null) {
          this.router.navigate(['/products'])
        }
      }
    });
  }

  auth = inject(UserService);
  url = inject(PreviousUrlService);
  previousPage = '';

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required])
  })
  backEnd = inject(UserProfileService);
  router = inject(Router);

  errorMessage:string[] = [];
  timer: any
  loginUser() {
    const user = {
      email: this.loginForm.value.email.trim(),
      password: this.loginForm.value.password
    }

    this.auth.login(user).subscribe({
      next:() => {
        this.router.navigate(['/products']);
      },
      error:(err) => {
        this.errorMessage.push(err.code.split('/')[1]);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.errorMessage = [];
        },3000)
      }
    })
  }
}
