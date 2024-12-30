import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, User } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment.development';
import 'zone.js';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideHttpClient(),
      ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect user if user is already logged in', () => {
    const data = 'xyz' as unknown as User;
    component['postService'].user$ = of(data);
    component.router.navigate = jest.fn();
    jest.useFakeTimers();
    component.ngAfterViewInit();
    jest.advanceTimersByTime(200);
    expect(component.router.navigate).toHaveBeenCalledWith(['/products']);
  })

  it('should sign p user successfully', () => {
    const form = component.signUp.value;
    form.firstName = 'Jems';
    form.lastName = 'Bond';
    form.email = 'jemsbond@treasure.get';
    form.password = 'hmmm....007';
    component.router.navigateByUrl = jest.fn();
    const error = throwError(() => ({
      code: 'err/err'
    }));
    //For successfully login
    component['postService'].register = jest.fn().mockReturnValue(of('something'));
    jest.useFakeTimers();
    component.SignUpUser();
    jest.advanceTimersByTime(200);
    expect(component.successMessage).toBe('Sign-up Successfully');
    jest.advanceTimersByTime(800);
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('login');
    jest.useRealTimers();

    //For postUserProfile error;
    component.post.postUserProfile = jest.fn().mockReturnValue(error);
    console.error = jest.fn().mockReturnValue(error);
    jest.useFakeTimers();
    component.SignUpUser();
    jest.advanceTimersByTime(200);
    expect(component.successMessage).toBe('Sign-up Successfully');
    jest.advanceTimersByTime(800);
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('login');
    expect(console.error).toHaveBeenCalledWith({
      code: 'err/err'
    });
    jest.useRealTimers();

    //For error signing up user
    component['postService'].register = jest.fn().mockReturnValue(error);
    jest.useFakeTimers();
    component.SignUpUser();
    jest.advanceTimersByTime(200);
    expect(component.errorMessage[0]).toBe('err');
    jest.advanceTimersByTime(2800);
    expect(component.errorMessage).toEqual([]);
    jest.useRealTimers();
  })
});
