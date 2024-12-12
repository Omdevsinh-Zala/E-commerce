import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment.development';
import 'zone.js';
import { AscendingComponent } from './ascending/ascending.component';
import { CardsComponent } from './cards/cards.component';
import { DescendingComponent } from './descending/descending.component';
import { DiscountComponent } from './discount/discount.component';
import { FilterComponent } from './filter/filter.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from '../../search/search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let route: ActivatedRoute;
  const mockActivatedRoute = {
    params: of({ id: '1' }),
    queryParams: of({ sort: 'asc' }),
    snapshot: { paramMap: { get: (key: string) => '1' } },
  };
  const data = {
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProductsComponent,
        CardsComponent,
        FilterComponent,
        DiscountComponent,
        AscendingComponent,
        DescendingComponent,
        SearchComponent,
      ],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      imports: [
        MatRadioGroup,
        MatRadioButton,
        ReactiveFormsModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
