import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ObservableInput, of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideHttpClient(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run OnInit', () => {
    const userName = 'Omdev';
    component.service.user$ = of(userName);
    jest.useFakeTimers();
    component.ngOnInit();
    jest.advanceTimersByTime(200);
    expect(component.firstName).toBe(userName);
    expect(component.lasName).toBe(undefined);
    jest.useRealTimers();

    const userData = {
      address: 'abc',
      email: 'omdev@cart.com',
      firstName: 'Omdevsinh',
      gender: 'male',
      lastName: 'Zala',
      phoneNumber: 1111111111,
    };
    const user = '' as unknown as User;
    const loggedInUser: User = { ...user, email: 'omdev@cart.com' };

    const recordData = {
      asdasd: userData,
      as: userData,
      asdaasdsd: userData,
      asdsdasd: userData,
    } as unknown as ObservableInput<object>;
    //For same email
    component.service.user = of(loggedInUser);
    component.backEnd.getUserProfile = () => of(recordData);
    jest.useFakeTimers();
    jest.advanceTimersByTime(100);
    component.ngOnInit();
    jest.advanceTimersByTime(400);
    expect(component.email).toBe(loggedInUser.email);
    expect(component.gender).toBe(userData.gender);
    expect(component.phoneNumber).toBe(userData.phoneNumber);
    expect(component.address).toBe(userData.address);
    jest.useRealTimers();
  });
});
