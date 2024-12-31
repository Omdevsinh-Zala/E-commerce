import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UserService } from '../user/user.service';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(public service: UserService, private http: HttpClient) {
    this.service.user$.subscribe({
      next: (user: string) => {
        this.user = user;
      },
    });
  }
  private baseUrl = environment.forUsers;
  user: string = null;

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
