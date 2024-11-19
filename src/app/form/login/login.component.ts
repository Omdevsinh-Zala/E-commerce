import { Component, inject, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
    this.auth.user$.subscribe({
      next:(data) => {
        if(data != null) {
          setTimeout(() => {
            this.router.navigate(['/products']);
          },1000)
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
  successMessage:string = '';
  timer: any;
  successTimer: any
  loginUser() {
    const user = {
      email: this.loginForm.value.email.trim(),
      password: this.loginForm.value.password
    }

    this.auth.login(user).subscribe({
      next:() => {
        this.successMessage = 'Login Successfully'
        clearTimeout(this.successTimer);
        this.successTimer = setTimeout(() => {
          this.router.navigate(['/products']);
          this.successMessage = '';
        },1000)
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
