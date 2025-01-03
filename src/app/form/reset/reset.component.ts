import { Component, inject, OnInit } from '@angular/core';
import { UserProfileService } from '../../service/profile/user-profile.service';
import { UserService } from '../../service/user/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss',
})
export class ResetComponent implements OnInit {
  auth = inject(UserProfileService);
  service = inject(UserService);
  ngOnInit(): void {
    this.service.user$.subscribe({
      next: (user: string) => {
        this.user = user;
      },
    });
    this.service.user.subscribe({
      next: (data) => {
        if (data.email) {
          this.email = data.email;
          this.resetForm.patchValue({
            email: this.email,
          });
        } else {
          this.router.navigate(['/login']);
        }
      },
    });
  }
  user = '';
  email: string | null = null;
  resetForm = new FormGroup({
    email: new FormControl({ value: this.email, disabled: true }, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', Validators.required),
  });

  errorMessage: string[] = [];
  timer: any;
  successMessage = '';
  successTimer: any;

  router = inject(Router);
  resetPassword() {
    const password = this.resetForm.value.password;
    this.service.updatePass(password).subscribe({
      next: () => {
        this.successMessage = 'Password updated Successfully';
        clearTimeout(this.successTimer);
        this.successTimer = setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/login']);
        }, 2000);
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
