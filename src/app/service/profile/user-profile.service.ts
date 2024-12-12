import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UserService } from '../user/user.service';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  service = inject(UserService);
  constructor() {
    this.service.user$.subscribe({
      next: (user: string) => {
        this.user = user;
      },
    });
  }
  private baseUrl = environment.forUsers;
  private user: string = null;
  private http = inject(HttpClient);

  getUserProfile() {
    return this.http.get(`${this.baseUrl + '/users'}.json`);
  }

  postUserProfile(data: UserProfile) {
    return this.http.post(`${this.baseUrl + '/users'}.json`, data);
  }

  updateUserProfile(data: UserProfile, endUrl: string) {
    return this.http.patch(
      `${this.baseUrl + '/users' + '/' + endUrl}.json`,
      data
    );
  }
}
