import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../service/user/user.service';
import { UserProfileService } from '../../service/profile/user-profile.service';
import { UserProfile } from '../../service/profile/user-profile';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  service = inject(UserService);
  backEnd = inject(UserProfileService);
  ngOnInit(): void {
    this.service.user$.subscribe({
      next: (user: string) => {
        this.firstName = user.split(' ')[0];
        this.lasName = user.split(' ')[1];
      },
    });
    this.service.user.subscribe({
      next: (data) => {
        this.email = data.email;
        this.backEnd.getUserProfile().subscribe({
          next: (data: Record<string, UserProfile>) => {
            const value = Object.values(data);
            value.filter((data) => {
              if (data.email == this.email) {
                this.gender = data.gender;
                this.phoneNumber = data.phoneNumber;
                this.address = data.address;
              }
            });
          },
        });
      },
    });
  }

  firstName: string | null = null;
  lasName: string | null = null;
  email: string | null = null;
  phoneNumber: number | null = null;
  gender: string | null = null;
  address: string | null = null;
}
