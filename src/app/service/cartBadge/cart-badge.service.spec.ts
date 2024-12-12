import { TestBed } from '@angular/core/testing';

import { CartBadgeService } from './cart-badge.service';
import { getAuth, provideAuth } from '@angular/fire/auth';
import 'zone.js';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment.development';

describe('CartBadgeService', () => {
  let service: CartBadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
      ],
    });
    service = TestBed.inject(CartBadgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
