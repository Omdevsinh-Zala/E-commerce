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
          next: (data: { [key: string]: UserProfile }) => {
            let keys = Object.keys(data);
            let value = Object.values(data);
            let index: number = 0;
            let user: UserProfile[] = value.filter((data) => {
              if (data['email'] == this.email) {
                  this.gender = data['gender'];
                  this.phoneNumber = data['phoneNumber'];
                  this.address = data['address'];
                  this.watch();
                  index = value.findIndex(
                    (data) => data['email'] == this.email
                  );
                  let key = keys[index];
                  this.endPoint.next(key);
              }
            });
          },
        });
      },
    });
  }
  errorMessage: string[] = [];
  successMessage: string = '';

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
    let firstName = this.updateForm.value.firstName;
    let lastName = this.updateForm.value.lastName;
    let gender = this.updateForm.value.gender;
    let email = this.updateForm.value.email;
    let phoneNumber = this.updateForm.value.phoneNumber;
    let address = this.updateForm.value.address;
    let userProfile: UserProfile = {
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
                  this.router.navigate(['/home']);
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
