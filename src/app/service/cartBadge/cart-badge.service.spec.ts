import { TestBed } from '@angular/core/testing';

import { CartBadgeService } from './cart-badge.service';
import { getAuth, provideAuth } from '@angular/fire/auth';
import 'zone.js';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment.development';
import { Products } from '../product/products';
import { UserCart } from './user-cart';
import { firstValueFrom } from 'rxjs';

describe('CartBadgeService', () => {
  let service: CartBadgeService;
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
    images: [''],
    thumbnail: 'string',
    category: '',
    description: '',
    quantity: 2,
  };

  const userCartData : UserCart = {
    products: [],
    user: 'User',
    completeOrder: false
  }

  beforeEach(() => {
    localStorageMock = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
      ],
    });
    service = TestBed.inject(CartBadgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add item to cart if user is not logged in', async () => {
    service.user = null;
    service.addToCart(productData);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('Cart');
    expect(service.products.length).toBe(1);
    expect(service.products[0].quantity).toBe(1);
    const count = await firstValueFrom(service.getCount());
    expect(count).toBe(service.products.length);
  });

  it('should increment item quantity if item is already in cart', async () => {
    service.user = null;
    localStorageMock.getItem.mockReturnValue(JSON.stringify([productData]));
    service.addToCart(productData);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('Cart');
    const index = service.products.findIndex((product) => product.id === productData.id);
    expect(service.products[index].quantity).toBe(productData.quantity + 1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('Cart', JSON.stringify(service.products));
    const count = await firstValueFrom(service.getCount());
    expect(count).toBe(service.products.length);
  })

  it('should add item to cart if item is not available in cart', async () => {
    service.user = null;
    service.addToCart(productData);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('Cart');
    expect(service.products).toEqual([productData]);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('Cart', JSON.stringify(service.products));
    const count = await firstValueFrom(service.getCount());
    expect(count).toBe(service.products.length);
  })

  it('should add item to cart if user is logged in and user cart is not available', async () => {
    service.user = 'User';
    localStorageMock.getItem.mockReturnValue(JSON.stringify([userCartData]));
    service.addToCart(productData);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('UserCart');
    const count = await firstValueFrom(service.getCount());
    expect(count).toBe(service.product.length);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('UserCart', JSON.stringify(service.product));
  })

  it('should add item to cart if the user is different', async () => {
    service.user = 'User2'
    localStorageMock.getItem.mockReturnValue(JSON.stringify([userCartData]));
    service.addToCart(productData);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('UserCart');
    const count = await firstValueFrom(service.getCount())
    expect(count).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('UserCart', JSON.stringify(service.product));
  })

  it('should increment item quantity if item is already in cart and user cart is available', () => {
    service.user = 'User';
    for(let i = 0; i < 10; i++) {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(service.product));
      service.addToCart(productData);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('UserCart');
      const userIndex = service.product.findIndex((cart) => cart.user == service.user);
      const index = service.product[userIndex].products.findIndex((product) => product.id == productData.id);
      expect(service.product[userIndex].products[index].quantity).toBe(i + 1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('UserCart', JSON.stringify(service.product));
    }
  })

  it('should get cart items if user is not logged in', async () => {
    service.user = '';
    service.addToCart(productData);
    const count = await firstValueFrom(service.getCount());
    expect(count).toBe(service.products.length);
  })

  it('should get cart item if user is logged in and user has no item in cart', async () => {
    service.user = 'User1';
    const count = await firstValueFrom(service.getCount())
    expect(count).toBe(0);
  })

  it('should decrese quantity of item if user is not logged in', async () => {
    service.user = null;
    const newData: Products = {...productData, quantity: 3};
    localStorageMock.getItem.mockReturnValue(JSON.stringify([newData]));
    const id = newData.id;
    service.decreaseQuantity(id);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('Cart');
    const index = service.products.findIndex((product) => product.id == id);
    expect(service.products[index].quantity).toBe(newData.quantity - 1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('Cart', JSON.stringify(service.products));
    const count1 = await firstValueFrom(service.getCount())
    expect(count1).toBe(service.products.length);

    const newData1: Products = { ...productData };
    localStorageMock.getItem.mockReturnValue(JSON.stringify([newData1]));
    const id1 = newData1.id;
    service.decreaseQuantity(id1);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('Cart');
    const index1 = service.products.findIndex((product) => product.id == id1);
    expect(service.products).toEqual(service.products.splice(index1, 1));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('Cart', JSON.stringify(service.products));
    const count2 = await firstValueFrom(service.getCount())
    expect(count2).toBe(service.products.length);
  })

  it('should get index of user', async () => {
    //For logged in user
    service.user = 'User';
    service.product = [userCartData];
    service.getIndex();
    const count1 = await firstValueFrom(service.getCount());
    expect(count1).toBe(service.product[0].products.length);
    
    service.user = 'User1';
    service.getIndex();
    const count2 = await firstValueFrom(service.getCount());
    expect(count2).toBe(0);

    //For not logged in user
    service.user = null;
    localStorageMock.getItem.mockReturnValue(JSON.stringify([productData]));
    service.getIndex();
    const count3 = await firstValueFrom(service.getCount());
    expect(count3).toBe(service.products.length);
  })

  it('should decrease quantity of item if user is logged in', async () => {
    service.user = 'User';
    const id1 = productData.id.toString();
    const newData1 = { ...productData, quantity: 3 }
    const quantity = 3;
    const data1: UserCart = { ...userCartData, products: [newData1] };
    localStorageMock.getItem.mockReturnValue(JSON.stringify([data1]));
    service.product = [data1];
    const userIndex = service.product.findIndex((cart) => cart.user == service.user);
    const index = service.product[userIndex].products.findIndex(
      (product) => product.id == id1
    );
    service.decreaseQuantity(id1);
    expect(service.product[userIndex].products[index].quantity).toBe(quantity - 1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('UserCart', JSON.stringify(service.product));
    const count1 = await firstValueFrom(service.getCount())
    expect(count1).toBe(service.product[userIndex].products.length);

    const  newData2 = productData;
    const data2 = { ...userCartData, products:[newData2]};
    localStorageMock.getItem.mockReturnValue(JSON.stringify([data2]));
    service.product = [data2];
    service.decreaseQuantity(id1);
    expect(service.product[userIndex].products).toEqual(service.product[userIndex].products.splice(index, 1));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('UserCart', JSON.stringify(service.product));
    const count2 = await firstValueFrom(service.getCount())
    expect(count2).toBe(service.product[userIndex].products.length);
  })

  it('should remove product from cart', async () => {
    //for logged in user
    service.user = 'User';
    const data = productData;
    const data1: UserCart[] = [{ ...userCartData, products: [productData] }];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(data1));
    service.product = (data1);
    service.removeProduct(data);
    const user1 = service.product.findIndex((cart) => cart.user == service.user);
    const index1 = service.product[user1].products.findIndex(
      (product) => product.id == data.id
    );
    expect(service.product[user1].products).toEqual(service.product[user1].products.splice(index1, 1))
    expect(localStorageMock.setItem).toHaveBeenCalledWith('UserCart', JSON.stringify(service.product));
    const count1 = await firstValueFrom(service.getCount())
    expect(count1).toBe(service.product[user1].products.length)

    //For not logged in user
    service.user = null;
    localStorageMock.getItem.mockReturnValue(JSON.stringify([data]));
    const index = service.products.findIndex((product) => product.id == data.id);
    service.removeProduct(data);
    expect(service.products).toEqual(service.products.splice(index, 1));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('Cart', JSON.stringify(service.products));
    const count2 = await firstValueFrom(service.getCount());
    expect(count2).toBe(service.products.length);
  })

  it('should update count if the product is available in the cart', async () => {
    //For logged in user
    service.user = 'User';
    const data1 = [{ ...userCartData, products: [productData] }];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(data1));
    service.updateCount();
    const user = service.product.findIndex((cart) => cart.user == service.user);
    const count1 = await firstValueFrom(service.getCount());
    expect(count1).toBe(service.product[user].products.length);
    const updateCount1 = await firstValueFrom(service.updateCount());
    expect(updateCount1).toBe(service.product[user].products.length);
    service.user = 'User1';
    service.updateCount();
    const count2 = await firstValueFrom(service.getCount());
    expect(count2).toBe(0);
    const updateCount2 = await firstValueFrom(service.updateCount());
    expect(updateCount2).toBe(0);

    //For not logged in user
    service.user = null;
    localStorageMock.getItem.mockReturnValue(JSON.stringify([productData]));
    service.updateCount()
    const count3 = await firstValueFrom(service.getCount());
    expect(count3).toBe(service.products.length);
    const updateCount3 = await firstValueFrom(service.updateCount());
    expect(updateCount3).toBe(service.products.length);
  })
});
