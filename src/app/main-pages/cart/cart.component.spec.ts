import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import 'zone.js';
import { provideHttpClient } from '@angular/common/http';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom, of } from 'rxjs';
import { Products } from '../../service/product/products';
import { UserCart } from '../../service/cartBadge/user-cart';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { CartRoutingModule } from './cart-routing.module';
import { CartCardComponent } from './cart-card/cart-card.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let localStorageMock: {
    setItem: jest.Mock<string>;
    getItem: jest.Mock<string>;
    removeItem: jest.Mock<string>;
  };
  const productData: Products = {
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

  const userCartData: UserCart = {
    products: [{ ...productData }],
    user: 'Test',
    completeOrder: false,
  };

  beforeEach(async () => {
    localStorageMock = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    };
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
      ],
      declarations: [CartComponent, CartCardComponent],
      imports: [
        CommonModule,
        CartRoutingModule,
        MatIconModule,
        MatBadgeModule,
        MatTableModule,
        MatPaginatorModule,
        SharedModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run all OnInit functions', () => {
    const user = 'Omdevsinh Zala';
    component.getProducts = jest.fn();
    component.ProductData = [productData];
    component.getTotal = () => of(12);
    component.service.user$ = of(user);
    jest.useFakeTimers();
    component.ngOnInit();
    jest.advanceTimersByTime(200);
    expect(component.user).toBe(user);
    expect(component.getProducts).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual([productData]);
    jest.advanceTimersByTime(100);
    expect(component.total).toBe(12);
  });

  it('should run after view function', () => {
    component.ngAfterViewInit();
    expect(component.dataSource.paginator).toEqual(component.paginator);
  });

  it('should get product', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([userCartData]));
    //For loggrd in user
    component.user = 'Test';
    component.getProducts();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('UserCart');
    const result = component.getProducts();
    expect(result).toEqual(userCartData.products);

    localStorageMock.getItem.mockReturnValue(JSON.stringify([productData]));
    //not logged in user
    component.user = null;
    component.getProducts();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('Cart');
    const result1 = component.getProducts();
    expect(result1).toEqual([productData]);
  });

  it('should get total', async () => {
    component.getProducts = jest.fn().mockReturnValue([productData]);
    component.getTotal();
    expect(component.getProducts).toHaveBeenCalled();
    const total = await firstValueFrom(component.getTotal());
    const cal = component.ProductData.reduce((a, c) => a + c.price, 0);
    expect(total).toBe(cal);
  });

  it('should run catch function', () => {
    component.getProducts = jest.fn().mockReturnValue(productData);
    const data = component.getProducts();
    component.onCatch();
    expect(component.dataSource.data).toEqual(data);
    expect(component.dataSource.paginator).toEqual(component.paginator);
  });

  it('should run total function', () => {
    jest.useFakeTimers();
    component.getProducts = jest.fn().mockReturnValue([productData]);
    const total = component.ProductData.reduce(
      (a, e) =>
        a + (e.price - e.price * (e.discountPercentage / 100)) * e.quantity,
      0
    );
    component.runTotal();
    expect(component.getProducts).toHaveBeenCalled();
    jest.advanceTimersByTime(200);
    expect(component.totalPrice).toBe(total);
    jest.useRealTimers();
  });

  it('should run buyNow', () => {
    component.count.updateCount = jest.fn();
    localStorageMock.getItem.mockReturnValue(JSON.stringify([userCartData]));

    //For user looged in
    component.user = 'Test';
    component.buyNow();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('UserCart');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'UserCart',
      JSON.stringify([])
    );
    expect(component.dataSource.data).toEqual(null);
    expect(component.dataSource.paginator).toEqual(component.paginator);
    expect(component.totalPrice).toBe(0);
    expect(component.ProductData.length).toBe(0);
    expect(component.count.updateCount).toHaveBeenCalled();

    //For user not logged in
    component.user = null;
    component.router.navigate = jest.fn();
    component.buyNow();
    expect(component.router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
