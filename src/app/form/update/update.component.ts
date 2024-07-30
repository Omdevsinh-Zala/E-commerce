import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeComponent } from '../../main-pages/home/home.component';
import { UserProfileService } from '../../service/profile/user-profile.service';
import { UserProfile } from 'firebase/auth';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent implements OnInit {
  service = inject(UserService);
  backEnd = inject(UserProfileService);
  ngOnInit(): void {
    this.service.user$.subscribe({
      next:(user:string) => {
        this.firstName = user.split(' ')[0];
        this.lasName = user.split(' ')[1];
      }
    });
    this.service.user.subscribe({
      next:(data) => {
        this.email = data.email
      }
    })
    this.backEnd.getUserProfile().subscribe({
      next:(data:{[key:string]:UserProfile}) => {
        let value = Object.values(data);
        let user = value.filter((data) => {
          return data['email'] == this.email
        });
        this.gender = user[0]['gender']
        this.address = user[0]['address']
        this.phoneNumber = user[0]['phoneNumber']
      },
      complete:() => {
        // this.updateForm.patchValue({
        //   firstName: new FormControl(this.firstName, Validators.required),
        //   lastName: new FormControl(this.lasName, Validators.required),
        //   gender: new FormControl(this.gender,Validators.required),
        //   phoneNumber: new FormControl(this.phoneNumber,[Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
        //   email: new FormControl({value: this.email, disabled: true}, [Validators.required, Validators.email]),
        //   address: new FormControl(this.address, [Validators.required])
        // })
      }
    });
  }
  errorMessage: string = '';

  firstName:string | unknown | null | undefined = null;
  lasName:string | unknown | null | undefined = null;
  email:string| unknown | null | undefined = null;
  phoneNumber:number | unknown | null | undefined = null;
  gender:string | unknown | null | undefined = null
  address:string | unknown | null | undefined = null;

  updateForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    gender: new FormControl('',Validators.required),
    phoneNumber: new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl({value: this.email, disabled: true}, [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required])
  })

  updateUser() {

  }
}
