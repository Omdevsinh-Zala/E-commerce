import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateComponent } from './update.component';
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
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';

describe('UpdateComponent', () => {
  let component: UpdateComponent;
  let fixture: ComponentFixture<UpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideHttpClient(),
      ],
      imports: [
        ReactiveFormsModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user', () => {
    const user = 'Test'
    component.service.user$ = of(user);
    jest.useFakeTimers();
    component.ngOnInit();
    jest.advanceTimersByTime(200);
    expect(component.firstName).toBe('Test');
    expect(component.lastName).toBe(undefined);
  })

  it('should fill user data to form', () => {
    component.watch = jest.fn();
    component.endPoint.next = jest.fn();
    const userObject = {
      email: 'test@gmail.com',
      gender: 'male',
      phoneNumber: 1234567890,
      address: 'xyz'
    };
    const data = {
      ...userObject,
    } as unknown as User;
    const userData = {
      'asdf': { ...data, email: 'test@gmail.com', gender:'male', address: 'xyz', phoneNumber: 1234567890 },
      'asdf1': { ...data, email: 'test@test1.com', gender:'male', address: 'xyz1', phoneNumber: 1234567891 },
      'asdf2': { ...data, email: 'test@test2.com', gender:'female', address: 'xyz2', phoneNumber: 1234567892 },
      'asdf3': { ...data, email: 'test@test3.com', gender:'male', address: 'xyz3', phoneNumber: 1234567893 },
    } as unknown as object;
    component.service.user = of(data);
    component.backEnd.getUserProfile = jest.fn().mockReturnValue(of(userData));
    jest.useFakeTimers();
    component.ngOnInit();
    jest.advanceTimersByTime(200);
    expect(component.email).toBe(data.email);
    jest.advanceTimersByTime(200);
    expect(component.gender).toBe(userObject.gender);
    expect(component.phoneNumber).toBe(userObject.phoneNumber);
    expect(component.address).toBe(userObject.address);
    expect(component.watch).toHaveBeenCalled();
    expect(component.endPoint.next).toHaveBeenCalledWith('asdf');
  })

  it('should run the watch function', () => {
    component.firstName = '';
    component.lastName = '';
    component.gender = '';
    component.phoneNumber = 0;
    component.email = '0';
    component.address = '';
    component.watch();
        // Validate the updateForm structure
        expect(component.updateForm).toBeInstanceOf(FormGroup);
    
        // Validate initial values
        expect(component.updateForm.get('firstName')?.value).toBe('');
        expect(component.updateForm.get('lastName')?.value).toBe('');
        expect(component.updateForm.get('gender')?.value).toBe('');
        expect(component.updateForm.get('phoneNumber')?.value).toBe(0);
        expect(component.updateForm.get('email')?.value).toBe('0');
        expect(component.updateForm.get('address')?.value).toBe('');
    
        // Validate validators
        expect(component.updateForm.get('firstName')?.hasValidator(Validators.required)).toBe(true);
        expect(component.updateForm.get('lastName')?.hasValidator(Validators.required)).toBe(true);
        expect(component.updateForm.get('gender')?.hasValidator(Validators.required)).toBe(true);
        expect(component.updateForm.get('phoneNumber')?.hasValidator(Validators.required)).toBe(true);
        expect(component.updateForm.get('phoneNumber')?.hasValidator(Validators.minLength(10))).toBe(false);
        expect(component.updateForm.get('phoneNumber')?.hasValidator(Validators.maxLength(10))).toBe(false);
        expect(component.updateForm.get('email')?.hasValidator(Validators.required)).toBe(true);
        expect(component.updateForm.get('email')?.hasValidator(Validators.email)).toBe(true);
        expect(component.updateForm.get('address')?.hasValidator(Validators.required)).toBe(true);
  })

  it('should update user data', () => {
    const error = throwError(() => ({
      code: 'err/err'
    })) as Observable<void>;
    const form = component.updateForm.value;
    form.firstName = 'james';
    form.lastName = 'bond';
    form.gender = 'male';
    form.phoneNumber = 1234567890;
    form.address = 'xyz';
    //for successfully updating data
    component.service.updateUser = jest.fn().mockReturnValue(of('xyz'));
    component.endPoint$ = of('xyz') as unknown as Observable<unknown>;
    component.backEnd.updateUserProfile = jest.fn().mockReturnValue(of('a'));
    component.router.navigateByUrl = jest.fn();
    jest.useFakeTimers();
    component.updateUser();
    jest.advanceTimersByTime(200);
    jest.advanceTimersByTime(200);
    jest.advanceTimersByTime(200);
    expect(component.successMessage).toBe('Update Profile');
    jest.advanceTimersByTime(1400);
    expect(component.successMessage).toBe('');
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('home');
    jest.useRealTimers();

    //For error updating data
    component.service.updateUser = jest.fn().mockReturnValue(error);
    jest.useFakeTimers();
    component.updateUser();
    jest.advanceTimersByTime(200);
    expect(component.errorMessage[0]).toBe('err');
    jest.advanceTimersByTime(2800);
    expect(component.errorMessage).toEqual([]);
    jest.useRealTimers();
  })
});
