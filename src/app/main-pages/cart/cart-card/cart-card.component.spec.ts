import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCardComponent } from './cart-card.component';

import { getAuth, provideAuth } from '@angular/fire/auth';
import 'zone.js';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../../environments/environment.development';
import { InputSignal, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Products } from '../../../service/product/products';

describe('CartCardComponent', () => {
  let component: CartCardComponent;
  let fixture: ComponentFixture<CartCardComponent>;
  const data = signal<Products>({
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartCardComponent],
      providers:[
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase())
      ],
      schemas:[
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartCardComponent);
    component = fixture.componentInstance;
    component.products = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
