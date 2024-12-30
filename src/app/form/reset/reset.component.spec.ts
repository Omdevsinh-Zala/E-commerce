import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetComponent } from './reset.component';
import { getAuth, provideAuth, User } from '@angular/fire/auth';
import 'zone.js';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment.development';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';

describe('ResetComponent', () => {
  let component: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
        MatLabel,
        BrowserAnimationsModule,
      ],
      declarations: [ResetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user successfully', () => {
    const user = 'Test';
    const userData:User = '' as unknown as User;
    const data = {
      ...userData,
      email: 'test@gmail.com'
    }
    component.resetForm.patchValue = jest.fn();
    component.router.navigate = jest.fn();
    component.service.user$ = of(user);
    component.service.user = of(data);
    jest.useFakeTimers();
    component.ngOnInit();
    jest.advanceTimersByTime(200);
    expect(component.user).toBe(user);

    //For data available
    jest.advanceTimersByTime(300);
    expect(component.email).toBe(data.email);
    expect(component.resetForm.patchValue).toHaveBeenCalledWith({
      email: component.email,
    })
    jest.useRealTimers();

    //For null data
    const nullData = {
      ...userData,
      email: ''
    };
    component.service.user = of(nullData);
    jest.useFakeTimers();
    component.ngOnInit();
    jest.advanceTimersByTime(200);
    expect(component.router.navigate).toHaveBeenCalledWith(['/login']);
    jest.useRealTimers();
  });

  it('should reset passwrod with success message or error message', () => {
    component.resetForm.value.password = '12q3werhtyut';
    component.router.navigate = jest.fn();
    //For successfully updating password
    component.service.updatePass = jest.fn().mockReturnValue(of('test'));
    jest.useFakeTimers();
    component.resetPassword();
    jest.advanceTimersByTime(200);
    expect(component.successMessage).toBe('Password updated Successfully');
    jest.advanceTimersByTime(2000);
    expect(component.successMessage).toBe('');
    expect(component.router.navigate).toHaveBeenCalledWith(['/login']);
    jest.useRealTimers();

    //For error updaing password
    const error = throwError(() => ({
      code: 'err/err'
    })) as Observable<void>;
    component.service.updatePass = jest.fn().mockReturnValue(error);
    jest.useFakeTimers();
    component.resetPassword();
    jest.advanceTimersByTime(200);
    expect(component.errorMessage[0]).toBe('err');
    jest.advanceTimersByTime(2800);
    expect(component.errorMessage).toEqual([]);
    jest.useRealTimers();
  })
});
