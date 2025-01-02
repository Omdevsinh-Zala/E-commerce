import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInfoComponent } from './product-info.component';
import 'zone.js';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
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
import { ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

jest.mock('swiper', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn(),
  }));
});

describe('ProductInfoComponent', () => {
  let component: ProductInfoComponent;
  let fixture: ComponentFixture<ProductInfoComponent>;
  let mockActivatedRoute: {
    params: Observable<{
      id: string;
    }>;
    queryParams: Observable<{
      sort: string;
    }>;
    snapshot: {
      paramMap: {
        get: () => string;
      };
    };
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
    mockActivatedRoute = {
      params: of({ id: '1' }),
      queryParams: of({ sort: 'asc' }),
      snapshot: { paramMap: { get: () => '1' } },
    };
  });

  it('should create', async () => {
    component.productData = data;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should run onInit method', () => {
    component['api'].getAllProducts = jest.fn().mockReturnValue(of([data]));
    component.getProduct = jest.fn();
    jest.useFakeTimers();
    component.ngOnInit();
    jest.advanceTimersByTime(200);
    expect(component.allProducts).toEqual([data]);
    expect(component.getProduct).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should run all afterviewInit function', () => {
    component.swiperInit = jest.fn();
    jest.useFakeTimers();
    component.ngAfterViewInit();
    jest.advanceTimersByTime(800);
    expect(component.swiperInit).toHaveBeenCalled();
    jest.useRealTimers();
    jest.useFakeTimers();
    component.ngAfterViewInit();
    component.first = new ElementRef({
      style: { display: '' },
    });
    component.spin = new ElementRef({
      style: { display: '' },
    });
    jest.advanceTimersByTime(1000);
    expect(component.first.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    jest.useRealTimers();
  });

  it('should get product from products', () => {
    component['title'].setTitle = jest.fn();
    component.allProducts = [data];
    component.getProducts(data.id);
    expect(component.productData).toBe(data);
    expect(component.ratings).toBe(data.rating);
    expect(component.images).toBe(data.images);
    expect(component['title'].setTitle).toHaveBeenCalledWith(
      `Product | ${data.title}`
    );
  });

  it('should get product id', () => {
    jest.useFakeTimers();
    component.allProducts = [data];
    component.getProducts = jest.fn();
    component.getProduct();
    expect(component.productId).toBe(data.id);
    expect(component.getProducts).toHaveBeenCalledWith(component.productId);
    jest.advanceTimersByTime(500);
    jest.useRealTimers();

    component['route'].params = throwError(() => ({
      code: 'err/err',
    }));
    console.error = jest.fn();
    component.getProduct();
    expect(console.error).toHaveBeenCalledWith({ code: 'err/err' });
  });

  it('should get related products with same tags', async () => {
    component.allProducts = [data];
    window.scrollTo = jest.fn();
    //For index != -1
    component.productData = data;
    component.getRelatedProducts(data.tags[0]);
    jest.useFakeTimers();
    jest.advanceTimersByTime(1000);
    expect(component.filteredProducts).toEqual([]);
    expect(component.dataSource instanceof MatTableDataSource).toBeTruthy();
    expect(component.dataSource.data).toEqual([]);
    expect(component.show).toBe(true);
    expect(component.dataSource.paginator).toEqual(component.paginaotr);
    // expect(window.scrollTo).toHaveBeenCalledWith(0, document.body.scrollHeight)
    jest.useRealTimers();

    //For index == -1
    component.productData = { ...data, id: '5' };
    component.getRelatedProducts(data.tags[0]);
    jest.useFakeTimers();
    jest.advanceTimersByTime(1000);
    expect(component.filteredProducts).toEqual([data]);
    expect(component.dataSource instanceof MatTableDataSource).toBeTruthy();
    expect(component.dataSource.data).toEqual([data]);
    expect(component.show).toBe(true);
    expect(component.dataSource.paginator).toEqual(component.paginaotr);
    // expect(window.scrollTo).toHaveBeenCalledWith(0, document.body.scrollHeight)
    jest.useRealTimers();
  });

  it('should route to product page', () => {
    component['router'].navigate = jest.fn();
    component.newProduct(data.id);
    expect(component['router'].navigate).toHaveBeenCalledWith([
      `/products/${data.id}`,
    ]);
  });

  it('should add to cart product', () => {
    component.count.addToCart = jest.fn();
    const e = new Event('click');
    e.stopImmediatePropagation = jest.fn();
    component.addToCart(data, e);
    expect(e.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.count.addToCart).toHaveBeenCalledWith(data);
  });
});
