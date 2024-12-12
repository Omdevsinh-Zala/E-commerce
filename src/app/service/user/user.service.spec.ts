import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';
import 'zone.js';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment.development';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import * as firebaseAuth from 'firebase/auth';
import { firstValueFrom } from 'rxjs';

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  getAuth: jest.fn(() => ({
    signOut: jest.fn().mockResolvedValue(undefined),
    updateCurrentUser: jest.fn().mockResolvedValue(undefined),
  })),
  updateCurrentUser: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  updatePassword: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let auth: Auth;

  const localStorageMock = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserService);
    auth = TestBed.inject(Auth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    const mockUserCredential = {
      user: {
        email: userData.email,
        displayName: userData.name,
      },
    };

    // Use Jest mock functions
    const createUserMock =
      firebaseAuth.createUserWithEmailAndPassword as jest.Mock;
    const updateProfileMock = firebaseAuth.updateProfile as jest.Mock;

    createUserMock.mockResolvedValue(mockUserCredential);
    updateProfileMock.mockResolvedValue({});

    await firstValueFrom(service.register(userData));

    expect(createUserMock).toHaveBeenCalledWith(
      auth,
      userData.email,
      userData.password
    );
    expect(updateProfileMock).toHaveBeenCalledWith(mockUserCredential.user, {
      displayName: userData.name,
    });
  });

  it('should login user succcessfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    const createUserMock = firebaseAuth.signInWithEmailAndPassword as jest.Mock;

    createUserMock.mockResolvedValue({});
    const setUserSpy = jest.spyOn(service, 'setUser');

    await firstValueFrom(service.login(userData));
    expect(createUserMock).toHaveBeenCalledWith(
      auth,
      userData.email,
      userData.password
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith('Access', 'true');
    expect(setUserSpy).toHaveBeenCalledWith();
  });

  it('should logout user successfully', async () => {
    const mockSigOut = auth.signOut as jest.Mock;

    mockSigOut.mockResolvedValue({});

    const usersSpy = jest.spyOn(service['users'], 'next');

    await firstValueFrom(service.logoutUser());
    expect(mockSigOut).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('Access');
    expect(usersSpy).toHaveBeenCalledWith(null);
  });

  // it('should update user successfully', async () => {
  //   const newName = 'XYZ';
  //   const mockAuth = {
  //     updateCurrentUser: jest.fn().mockResolvedValue(undefined),
  //   };
  //   (firebaseAuth.getAuth as jest.Mock).mockResolvedValue(mockAuth);
  //   const mockUpdateUser = firebaseAuth.updateCurrentUser as jest.Mock;
  //   mockUpdateUser.mockResolvedValue({});

  //   const mockUpdateProfile = firebaseAuth.updateProfile as jest.Mock;
  //   mockUpdateProfile.mockResolvedValue({});

  //   await firstValueFrom(service.updateUser(newName));
  //   expect(mockAuth.updateCurrentUser).toHaveBeenCalledWith(auth.currentUser);
  //   expect(mockUpdateProfile).toHaveBeenCalledWith(auth.currentUser, {
  //     displayName: newName,
  //   });
  // });

  it('should update Password successfully', async () => {
    const newPass = '123efvth65y3tgrvf';
    const mockUpdatePassword = firebaseAuth.updatePassword as jest.Mock;
    mockUpdatePassword.mockResolvedValue({});

    await firstValueFrom(service.updatePass(newPass));
    expect(mockUpdatePassword).toHaveBeenCalledWith(auth.currentUser, newPass);
  });
});
