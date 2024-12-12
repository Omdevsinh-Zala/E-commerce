import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInfoComponent } from './product-info.component';
import 'zone.js';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from './../../environments/environment.development';
import { Products } from '../service/product/products';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('ProductInfoComponent', () => {
  let component: ProductInfoComponent;
  let fixture: ComponentFixture<ProductInfoComponent>;
  const mockActivatedRoute = {
    params: of({ id: '1' }),
    queryParams: of({ sort: 'asc' }),
    snapshot: { paramMap: { get: (key: string) => '1' } },
  };
  const data: Products = {
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
    images: ['1', '2'],
    thumbnail: 'string',
    category: '',
    description: '',
    quantity: 2,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      declarations: [ProductInfoComponent],
      imports: [MatIconModule, MatProgressSpinnerModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    component.productData = data;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
