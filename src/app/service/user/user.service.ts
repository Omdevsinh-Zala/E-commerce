import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { from, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  fireBaseAuth = inject(Auth);
  user = user(this.fireBaseAuth);
  private users = new ReplaySubject(1);
  user$ = this.users.asObservable();

  register(data) {
    const promise = createUserWithEmailAndPassword(this.fireBaseAuth, data.email, data.password)
    .then((Response) => updateProfile(Response.user, {displayName: data.name}));

    return from(promise);
  }

  login(data) {
    const promise = signInWithEmailAndPassword(this.fireBaseAuth, data.email, data.password);
    return from(promise);
  }

  logoutUser() {
   let promise = this.fireBaseAuth.signOut().then(() => {this.users.next(null)}).then(() => {
    this.setUser();
   })
    return from(promise)
  }

  setUser() {
    this.user.subscribe({
      next: (data) => {
        if (data) {
          this.users.next(data.displayName);
        } else {
          this.users.next(null)
        }
      }
    })
  }

  auth = getAuth();
  updateUser(userName: string) {
    let promise = this.auth.updateCurrentUser(this.fireBaseAuth.currentUser).then((Response) => updateProfile(this.fireBaseAuth.currentUser , {displayName: userName}));
    return from(promise);
  }
}
