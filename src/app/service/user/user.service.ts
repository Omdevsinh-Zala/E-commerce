import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { from, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  fireBaseAuth = inject(Auth);
  user = user(this.fireBaseAuth);
  private users = new ReplaySubject(1);
  user$ = this.users.asObservable();
  access = localStorage.getItem('Access');

  register(data) {
    const promise = createUserWithEmailAndPassword(
      this.fireBaseAuth,
      data.email,
      data.password
    ).then((Response) =>
      updateProfile(Response.user, { displayName: data.name })
    );

    return from(promise);
  }

  login(data) {
    const promise = signInWithEmailAndPassword(
      this.fireBaseAuth,
      data.email,
      data.password
    ).then(() => {
      localStorage.setItem('Access', 'true');
      this.setUser();
    });
    return from(promise);
  }

  logoutUser() {
    const promise = this.fireBaseAuth.signOut().then(() => {
      this.users.next(null);
      localStorage.removeItem('Access');
    });
    return from(promise);
  }

  setUser() {
    this.user.subscribe({
      next: (data) => {
        if (data) {
          this.users.next(data.displayName);
        } else {
          this.users.next(null);
        }
      },
    });
  }

  auth = getAuth();
  updateUser(userName: string) {
    const promise = this.auth
      .updateCurrentUser(this.fireBaseAuth.currentUser)
      .then(() =>
        updateProfile(this.fireBaseAuth.currentUser, { displayName: userName })
      );
    return from(promise);
  }

  updatePass(password: string) {
    const promise = updatePassword(this.fireBaseAuth.currentUser, password).then();
    return from(promise);
  }
}
