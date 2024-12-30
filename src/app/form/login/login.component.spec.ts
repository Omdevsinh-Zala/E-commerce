import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import 'zone.js';
import { provideHttpClient } from '@angular/common/http';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment.development';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
      ],
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatLabel,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.router.navigate = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoul check if user is logged in', () => {
    //For data != null
    component.auth.user$ = of('Devid');
    jest.useFakeTimers();
    component.ngOnInit();
    jest.advanceTimersByTime(100);
    jest.advanceTimersByTime(1000);
    expect(component.router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should login user properly', () => {
    component.router.navigate = jest.fn();
    component.loginForm.value.email = 'cart@gmail.com';
    component.loginForm.value.password = '13w4et';
    //For successfull message
    component.auth.login = jest.fn().mockReturnValue(of(true));
    jest.useFakeTimers();
    component.loginUser();
    jest.advanceTimersByTime(100);
    expect(component.successMessage).toBe('Login Successfully');
    jest.advanceTimersByTime(1000);
    expect(component.router.navigate).toHaveBeenCalledWith(['/products']);
    expect(component.successMessage).toBe('');
    jest.useRealTimers();

    const error = throwError(() => ({
      code: 'err/err'
    })) as Observable<void>;
    
    component.auth.login = () => error;
    jest.useFakeTimers();
    component.loginUser();
    jest.advanceTimersByTime(100);
    expect(component.errorMessage[0]).toEqual('err');
    jest.advanceTimersByTime(3000);
    expect(component.errorMessage).toEqual([]);
    jest.useRealTimers();
  })
});
