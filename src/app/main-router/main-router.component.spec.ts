import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRouterComponent } from './main-router.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment.development';
import 'zone.js';
import { MatIconModule } from '@angular/material/icon';

describe('MainRouterComponent', () => {
  let component: MainRouterComponent;
  let fixture: ComponentFixture<MainRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainRouterComponent, NavbarComponent],
      imports:[
        RouterOutlet,
        MatIconModule
      ],
      providers:[
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase())
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
