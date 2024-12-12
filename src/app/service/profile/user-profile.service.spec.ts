import { TestBed } from '@angular/core/testing';

import { UserProfileService } from './user-profile.service';
import { provideHttpClient } from '@angular/common/http';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment.development';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import 'zone.js';
import { firstValueFrom } from 'rxjs';

describe('UserProfileService', () => {
  let service: UserProfileService;
  let httpTesting: HttpTestingController;
  let env = environment.forUsers;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserProfileService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user data', async () => {
    const user$ = service.getUserProfile();
    const promise = firstValueFrom(user$);
    const req = httpTesting.expectOne(
      `${env}/users.json`,
      'Requesting user data'
    );
    expect(req.request.method).toBe('GET');
    const recieveData = {
      1: {
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        gender: 'string',
        phoneNumber: 1111111111,
        address: 'string',
      },
      2: {
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        gender: 'string',
        phoneNumber: 1111111111,
        address: 'string',
      },
    };
    req.flush(recieveData);
    expect(await promise).toEqual(recieveData);
  });

  it('should post user data', async () => {
    const data = {
      firstName: 'string',
      lastName: 'string',
      email: 'string',
      gender: 'string',
      phoneNumber: 1111111111,
      address: 'string',
    };
    const data$ = service.postUserProfile(data);
    const promise = firstValueFrom(data$);
    const req = httpTesting.expectOne(`${env}/users.json`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
    expect(await promise).toEqual(data);
  });

  it('should update the user', async () => {
    const data = {
      firstName: 'Hello',
      lastName: 'string',
      email: 'string',
      gender: 'string',
      phoneNumber: 1111111111,
      address: 'string',
    };
    const endUrl = 2;
    const user$ = service.updateUserProfile(data, `${endUrl}`);
    const promise = firstValueFrom(user$);
    const req = httpTesting.expectOne(`${env}/users/${endUrl}.json`);
    expect(req.request.method).toContain('PATCH');
    req.flush(data);
    expect(await promise).toEqual(data);
  });
});
