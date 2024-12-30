import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from '../../service/profile/user-profile.service';
import { UserProfile } from '../../service/profile/user-profile';
import { UserService } from '../../service/user/user.service';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateComponent implements OnInit {
  service = inject(UserService);
  backEnd = inject(UserProfileService);
  ngOnInit(): void {
    this.service.user$.subscribe({
      next: (user: string) => {
        this.firstName = user.split(' ')[0];
        this.lastName = user.split(' ')[1];
      },
    });
    this.service.user.subscribe({
      next: (data) => {
        this.email = data.email;
        this.backEnd.getUserProfile().subscribe({
          next: (data: Record<string, UserProfile>) => {
            const keys = Object.keys(data);
            const value = Object.values(data);
            let index = 0;
            value.filter((data) => {
              if (data['email'] == this.email) {
                this.gender = data['gender'];
                this.phoneNumber = data['phoneNumber'];
                this.address = data['address'];
                this.watch();
                index = value.findIndex((data) => data['email'] == this.email);
                const key = keys[index];
                this.endPoint.next(key);
              }
            });
          },
        });
      },
    });
  }
  errorMessage: string[] = [];
  successMessage = '';

  endPoint = new ReplaySubject(1);
  endPoint$ = this.endPoint.asObservable();

  firstName: string | null | undefined = null;
  lastName: string | null | undefined = null;
  email: string | null | undefined = null;
  phoneNumber: number | null | undefined = null;
  gender: string | null | undefined = null;
  address: string | null | undefined = null;

  updateForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    phoneNumber: new FormControl(1, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.email,
    ]),
    address: new FormControl('', [Validators.required]),
  });

  watch() {
    this.updateForm = new FormGroup({
      firstName: new FormControl(this.firstName, Validators.required),
      lastName: new FormControl(this.lastName, Validators.required),
      gender: new FormControl(this.gender, Validators.required),
      phoneNumber: new FormControl(this.phoneNumber, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      email: new FormControl({ value: this.email, disabled: true }, [
        Validators.required,
        Validators.email,
      ]),
      address: new FormControl(this.address, [Validators.required]),
    });
  }
  timer: any;
  successTimer: any;
  router = inject(Router);
  updateUser() {
    const firstName = this.updateForm.value.firstName;
    const lastName = this.updateForm.value.lastName;
    const gender = this.updateForm.value.gender;
    const phoneNumber = this.updateForm.value.phoneNumber;
    const address = this.updateForm.value.address;
    const userProfile: UserProfile = {
      firstName: firstName,
      lastName: lastName,
      email: this.email,
      gender: gender,
      phoneNumber: phoneNumber,
      address: address,
    };
    this.service.updateUser(firstName + ' ' + lastName).subscribe({
      next: () => {
        this.endPoint$.subscribe({
          next: (key: string) => {
            this.backEnd.updateUserProfile(userProfile, key).subscribe({
              next: () => {
                this.successMessage = 'Update Profile';
                clearTimeout(this.successTimer);
                this.successTimer = setTimeout(() => {
                  this.successMessage = '';
                  this.router.navigateByUrl('home');
                }, 2000);
              },
            });
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
