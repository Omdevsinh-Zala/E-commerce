import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsComponent } from './cards.component';
import { getAuth, provideAuth } from '@angular/fire/auth';
import 'zone.js';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../../environments/environment.development';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  input,
  InputSignal,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { Products } from '../../../service/product/products';
import { of } from 'rxjs';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;
  let data:InputSignal<Products>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
      ],
      imports: [MatIconModule, CommonModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    TestBed.runInInjectionContext(() => {
      data = input<Products>({
        id: '1',
        title: 'string',
        price: 100,
        discountPercentage: 10,
        rating: 4,
        stock: 7,
        tags: [''],
        brand: 'string',
        sku: 'string',
        weight: 5,
        dimensions: {
          width: 8,
          height: 8,
          depth: 8,
        },
        warrantyInformation: 'string',
        shippingInformation: 'string',
        availabilityStatus: 'string',
        reviews: [
          {
            rating: 3,
            comment: 'string',
            date: 'string',
            reviewerName: 'string',
            reviewerEmail: 'string',
          },
        ],
        returnPolicy: 'string',
        minimumOrderQuantity: 1,
        meta: {
          createdAt: 'string',
          updatedAt: 'string',
          barcode: 'string',
          qrCode: 'string',
        },
        images: [''],
        thumbnail: 'string',
        category: '',
        description: '',
        quantity: 2,
      }) as unknown as InputSignal<Products>;
    })
  });

  it('should create', () => {
    component.products = data;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set user', async () => {
    jest.useFakeTimers();
    const value = 'two';
    component.service.user$ = of(value);
    component.products = data;
    component.ngOnInit();
    jest.advanceTimersByTime(200);
    expect(component.user).toBe(value);
    jest.useRealTimers();
  })

  it('should add item to cart', () => {
    const event = new Event('click');
    event.stopImmediatePropagation = jest.fn();
    component['count'].addToCart = jest.fn();
    component.addToCart(data(), event);
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
    expect(component['count'].addToCart).toHaveBeenCalledWith(data())
  })
});
