import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user/user.service';
import { Router } from '@angular/router';
import { UserProfileService } from '../../service/profile/user-profile.service';
import { UserProfile } from '../../service/profile/user-profile';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements AfterViewInit {
  constructor(private postService: UserService) {}

  ngAfterViewInit(): void {
    this.postService.user$.subscribe({
      next: (data) => {
        if (data) {
          this.router.navigate(['/products']);
        }
      },
    });
  }

  router = inject(Router);
  errorMessage: string[] = [];
  successMessage: string = '';
  timer: any;
  successTimer: any;
  post = inject(UserProfileService);

  signUp = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  SignUpUser() {
    const firstName: string = this.signUp.value.firstName.trim();
    const lastName: string = this.signUp.value.lastName.trim();
    const email: string = this.signUp.value.email.trim();
    const password: string = this.signUp.value.password;

    const user = {
      name: firstName + ' ' + lastName,
      email: email,
      password: password,
    };

    this.postService.register(user).subscribe({
      next: () => {
        this.successMessage = 'Sign-up Successfully';
        clearTimeout(this.successTimer);
        this.successTimer = setTimeout(() => {
          this.router.navigateByUrl('login');
          this.successMessage = '';
        }, 1000);
        let postUser: UserProfile = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          gender: null,
          phoneNumber: null,
          address: null,
        };
        this.post.postUserProfile(postUser).subscribe({
          error: (err) => {
            console.error(err);
          },
        });
      },
      error: (err) => {
        this.errorMessage.push(err.code.split('/')[1]);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.errorMessage = [];
        }, 3000);
      },
    });
  }
}
