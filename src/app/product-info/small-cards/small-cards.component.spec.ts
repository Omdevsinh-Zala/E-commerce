import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallCardsComponent } from './small-cards.component';
import 'zone.js';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { InputSignal, signal } from '@angular/core';
import { Products } from '../../service/product/products';

describe('SmallCardsComponent', () => {
  let component: SmallCardsComponent;
  let fixture: ComponentFixture<SmallCardsComponent>;
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
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmallCardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmallCardsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.data = data as unknown as InputSignal<Products>;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit product it', () => {
    component.data = data as unknown as InputSignal<Products>;
    fixture.detectChanges();

    let emiitedValue = '';
    component.signal.subscribe((id) => emiitedValue = id)

    const cardElement = fixture.nativeElement.querySelector('.card');
    cardElement.click();
    fixture.detectChanges();
    expect(emiitedValue).toEqual('1');
  });

  it('should match all values', () => {
    component.data = data as unknown as InputSignal<Products>;
    fixture.detectChanges();

    const cardElement = fixture.nativeElement.querySelector('.product-thumbnail');
    let cardTitle = fixture.nativeElement.querySelector('.card-inner-title');
    const actualThumnail = cardElement.src.split('/');
    const cardTitleText = cardTitle.textContent;
    expect(actualThumnail.pop()).toEqual(data().thumbnail);
    expect(cardTitleText).toEqual(data().title);
  })
});