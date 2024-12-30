import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
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
import { ElementRef } from '@angular/core';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
      ],
      imports: [MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle navbar properly', () => {
    component.nav = new ElementRef({
      classList: {
        add: jest.fn(),
        remove: jest.fn()
      }
    });
    //For isHidden true
    component.isHidden = true
    jest.useFakeTimers();
    component.toggleNav();
    expect(component.nav.nativeElement.classList.add).toHaveBeenCalledWith('nav-close');
    expect(component.nav.nativeElement.classList.add).toHaveBeenCalledWith('nav-show');
    expect(component.isHidden).toBe(false);
    jest.advanceTimersByTime(500);
    expect(component.nav.nativeElement.classList.remove).toHaveBeenCalledWith('nav-show');
    jest.useRealTimers();
    
    //For isHidden False
    component.isHidden = false;
    jest.useFakeTimers();
    component.toggleNav();
    expect(component.nav.nativeElement.classList.add).toHaveBeenCalledWith('nav-hide');
    expect(component.isHidden).toBe(true);
    jest.advanceTimersByTime(300);
    expect(component.nav.nativeElement.classList.remove).toHaveBeenCalledWith('nav-close');
    expect(component.nav.nativeElement.classList.remove).toHaveBeenCalledWith('nav-hide');
    jest.useRealTimers();
  })
});
