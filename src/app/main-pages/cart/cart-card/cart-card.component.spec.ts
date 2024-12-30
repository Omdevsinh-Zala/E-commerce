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
import { UserCart } from '../../../service/cartBadge/user-cart';
import { of } from 'rxjs';

describe('CartCardComponent', () => {
  let component: CartCardComponent;
  let fixture: ComponentFixture<CartCardComponent>;
  let localStorageMock: {
    setItem: jest.Mock<string>;
    getItem: jest.Mock<string>;
  };
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

  const userData: UserCart = {
    products: [{ ...data() }],
    completeOrder: false,
    user: 'Test',
  };

  beforeEach(async () => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CartCardComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CartCardComponent);
    component = fixture.componentInstance;
    component.products = data;
    fixture.detectChanges();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run OnInit function', () => {
    const user = 'Test';
    component.changeTotal = jest.fn();
    component.service.user$ = of(user);
    jest.useFakeTimers();
    component.ngOnInit();
    jest.advanceTimersByTime(200);
    expect(component.user).toBe(user);
    expect(component.changeTotal).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should run changes on ngOnChanges', () => {
    //For logged in user
    component.user = 'Test';
    localStorageMock.getItem.mockReturnValue(JSON.stringify([userData]));
    component.ngOnChanges();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('UserCart');
    expect(component.product).toEqual([userData]);

    //For looged out user
    component.user = null;
    localStorageMock.getItem.mockReturnValue(JSON.stringify([data()]));
    component.ngOnChanges();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('Cart');
    expect(component.product).toEqual([data()]);
  });

  it('should increase quantity', () => {
    const event = new Event('click');
    component.signal.emit = jest.fn();
    component.changeTotal = jest.fn();
    component.user = 'Test';
    localStorageMock.getItem.mockReturnValue(JSON.stringify([userData]));
    event.stopImmediatePropagation = jest.fn();
    component.increaseQuantity(data().id, event);
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('UserCart');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'UserCart',
      JSON.stringify(component.product)
    );
    expect(component.signal.emit).toHaveBeenCalledWith(false);
    expect(component.changeTotal).toHaveBeenCalled();
    expect(component['count'].product).toEqual(component.product);

    //for user not logged in
    component.user = null;
    component.product = [];
    localStorageMock.getItem.mockReturnValue(JSON.stringify([data()]));
    component.increaseQuantity(data().id, event);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('Cart');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'Cart',
      JSON.stringify(component.product)
    );
    expect(component.signal.emit).toHaveBeenCalledWith(false);
    expect(component.changeTotal).toHaveBeenCalled();
    expect(component['count'].product).toEqual(component.product);
  });

  it('should decrese quantity', () => {
    const event = new Event('click');
    event.stopImmediatePropagation = jest.fn();
    component['count'].decreaseQuantity = jest.fn();
    component.signal.emit = jest.fn();
    component.changeTotal = jest.fn();
    component.decreaseQuantity(data().id, event);
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
    expect(component['count'].decreaseQuantity).toHaveBeenCalledWith(data().id);
    expect(component.signal.emit).toHaveBeenCalledWith(false);
    expect(component.changeTotal).toHaveBeenCalled();
  });

  it('should change total', () => {
    component.total.emit = jest.fn();
    component.changeTotal();
    expect(component.total.emit).toHaveBeenCalledWith(false);
  });

  it('Should run remove product function successfully', () => {
    const event = new Event('click');
    event.stopImmediatePropagation = jest.fn();
    component['count'].removeProduct = jest.fn();
    component.signal.emit = jest.fn();
    component.changeTotal = jest.fn();
    component.removeProduct(data(), event);
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
    expect(component['count'].removeProduct).toHaveBeenCalledWith(data());
    expect(component.signal.emit).toHaveBeenCalledWith(false);
    expect(component.changeTotal).toHaveBeenCalled();
  });
});
