import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import 'zone.js';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment.development';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should have as title mycart', () => {
    expect(component.title).toEqual('mycart');
  });

  it('should run onInit', () => {
    component.auth.access = 'true';
    component.auth.setUser = jest.fn();
    component.ngOnInit();
    expect(component.auth.setUser).toHaveBeenCalled();
  })
});
