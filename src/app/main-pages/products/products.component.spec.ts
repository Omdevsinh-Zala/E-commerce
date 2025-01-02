import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { of, throwError } from 'rxjs';
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
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Products } from '../../service/product/products';
import { ElementRef } from '@angular/core';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  const mockActivatedRoute = {
    params: of({ id: '1' }),
    queryParams: of({ sort: 'asc' , Category: 'mobile', discount: ['10', '20']}),
    snapshot: { paramMap: { get: () => '1' } },
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
    images: [''],
    thumbnail: 'string',
    category: 'string',
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
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initiate properly', () => {
    component.selectOption = jest.fn();
    component.fetchData = jest.fn();
    component.ngOnInit();
    expect(component.selectOption).toHaveBeenCalled();
    expect(component.fetchData).toHaveBeenCalled();
  });

  it('should run clear', () => {
    component.clearDiscount = true;
    component['runClear']();
    expect(component.clearDiscount).toBe(false)
  })

  it('should run fetch data function properly', () => {
    component['api'].getAllProducts = jest.fn().mockReturnValue(of([data]));
    component.productsData.push = jest.fn();
    component.productsData.map = jest.fn();
    component.filteringData = jest.fn();
    //for successfully fetching the data
    jest.useFakeTimers();
    component.fetchData();
    jest.advanceTimersByTime(200);
    expect(component.productsData.push).toHaveBeenCalledWith(data);
    jest.advanceTimersByTime(200);
    expect(component.updatedProductsData).toEqual(component.productsData);
    expect(component.products.paginator).toEqual(component.paginator);
    expect(component.isFetched).toBe(true);
    expect(component.filteringData).toHaveBeenCalled();
    jest.useRealTimers();

    //For occuring error
    const error = throwError(() => ({
      code: 'error'
    }));
    component['api'].getAllProducts = jest.fn().mockReturnValue(error);
    console.error = jest.fn();
    jest.useFakeTimers();
    component.fetchData();
    jest.advanceTimersByTime(100);
    expect(console.error).toHaveBeenCalledWith({
      code: 'error'
    });
  })

  it('should run after view init function', () => {
    component.main = new ElementRef({
      style: {
        display: ''
      }
    })
    component.spin = new ElementRef({
      style: {
        display: ''
      }
    })
    jest.useFakeTimers();
    component.ngAfterViewInit();
    expect(component.products.paginator).toEqual(component.paginator);
    jest.advanceTimersByTime(1500);
    expect(component.main.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
  });

  it('should signal the change', () => {
    component.filteringData = jest.fn();
    const data = true;
    component.SignalChange(data);
    expect(component.ChangeSignal).toBe(true);
    expect(component.filteringData).toHaveBeenCalled();
  });

  it('should filter data properly', () => {
    const params = {
      Category: 'something',
      sort: 'something',
      discount: ['10', '20']
    } as unknown as Params;
    component.categoryFiltering = jest.fn();
    component.discountFiltering = jest.fn();
    component.sortFiltering = jest.fn();
    component.withOutSort = jest.fn();
    component.sortWithId = jest.fn();
    component.productsData = [data];
    component.spin = new ElementRef({
      style: {
        display: ''
      }
    });
    component.secondary = new ElementRef({
      style: {
        display: ''
      }
    });

    //For only category
    const params1 = {
      discount: [], sort: '', Category: 'mobile'
    }
    component['router'].queryParams = of(params1);
    jest.useFakeTimers();
    component.filteringData();
    jest.advanceTimersByTime(100);
    expect(component.secondary.nativeElement.style.display).toBe('none');
    expect(component.spin.nativeElement.style.display).toBe('block');
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    // expect(component.categoryFiltering).toHaveBeenCalledWith(params['Category']);
    jest.useRealTimers();

    //for only discount
    const params2 = {
      ...params, Category: '', sort: '', 
    }
    component['router'].queryParams = of(params2);
    jest.useFakeTimers();
    component.filteringData();
    jest.advanceTimersByTime(100);
    expect(component.secondary.nativeElement.style.display).toBe('none');
    expect(component.spin.nativeElement.style.display).toBe('block');
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    expect(component.discountFiltering).toHaveBeenCalledWith(params2['discount']);
    jest.useRealTimers();

    //for only sort
    const params3 = {
      ...params, Category: '', discount: []
    }
    component['router'].queryParams = of(params3);
    jest.useFakeTimers();
    component.filteringData();
    jest.advanceTimersByTime(100);
    expect(component.secondary.nativeElement.style.display).toBe('none');
    expect(component.spin.nativeElement.style.display).toBe('block');
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    expect(component.sortFiltering).toHaveBeenCalledWith(params3['Category'],params3['sort'], params3['discount']);
    jest.useRealTimers();

    //For category and discount
    const param4 = {
      ...params, sort: ''
    }
    component['router'].queryParams = of(param4);
    jest.useFakeTimers();
    component.filteringData();
    jest.advanceTimersByTime(100);
    expect(component.secondary.nativeElement.style.display).toBe('none');
    expect(component.spin.nativeElement.style.display).toBe('block');
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    expect(component.withOutSort).toHaveBeenCalledWith(param4['Category'],param4['discount']);
    jest.useRealTimers();

    //for category and sort
    const param5 = {
      ...params, discount: []
    }
    component['router'].queryParams = of(param5);
    jest.useFakeTimers();
    component.filteringData();
    jest.advanceTimersByTime(100);
    expect(component.secondary.nativeElement.style.display).toBe('none');
    expect(component.spin.nativeElement.style.display).toBe('block');
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    expect(component.sortFiltering).toHaveBeenCalledWith(param5['Category'],param5['sort'], param5['discount']);
    jest.useRealTimers();

    //for discount and sort
    const param6 = {
      ...params, Category: ''
    }
    component['router'].queryParams = of(param6);
    jest.useFakeTimers();
    component.filteringData();
    jest.advanceTimersByTime(100);
    expect(component.secondary.nativeElement.style.display).toBe('none');
    expect(component.spin.nativeElement.style.display).toBe('block');
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    expect(component.sortFiltering).toHaveBeenCalledWith(param6['Category'],param6['sort'], param6['discount']);
    jest.useRealTimers();

    //for all available
    const param7 = {
      ...params
    }
    component['router'].queryParams = of(param7);
    jest.useFakeTimers();
    component.filteringData();
    jest.advanceTimersByTime(100);
    expect(component.secondary.nativeElement.style.display).toBe('none');
    expect(component.spin.nativeElement.style.display).toBe('block');
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    expect(component.sortFiltering).toHaveBeenCalledWith(param7['Category'],param7['sort'], param7['discount']);
    jest.useRealTimers();

    //for all not available
    const param8 = {
      ...params, Category: '', discount: '', sort: ''
    }
    component['router'].queryParams = of(param8);
    jest.useFakeTimers();
    component.filteringData();
    jest.advanceTimersByTime(100);
    expect(component.secondary.nativeElement.style.display).toBe('none');
    expect(component.spin.nativeElement.style.display).toBe('block');
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    expect(component.sortWithId).toHaveBeenCalledWith();
    jest.useRealTimers();
  });

  it('should run selected option', () => {
    const params = {
      Category: 'string', sort: '', discount: ''
    }
    component['router'].queryParams = of(params);
    jest.useFakeTimers();
    component.selectOption();
    jest.advanceTimersByTime(100);
    expect(component.selectedValues).toEqual([params['Category'],params['discount'], params['sort']]);
    jest.useRealTimers();
  });

  it('should run category filter', () => {
    component.spin = new ElementRef({
      style: {
        display: ''
      }
    });
    component.secondary = new ElementRef({
      style: {
        display: ''
      }
    });
    component['runClear'] = jest.fn();
    component.productsData = [data];
    jest.useFakeTimers();
    component.categoryFiltering('mobile');
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    expect(component['runClear']).toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(true);
    expect(component.updatedProductsData).toEqual([]);
    expect(component.products.paginator).toEqual(component.paginator);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block')
    expect(component.spin.nativeElement.style.display).toBe('none')
    jest.useRealTimers();

    //for matching category
    component.productsData = [data];
    jest.useFakeTimers();
    component.categoryFiltering('string');
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    expect(component['runClear']).toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(false);
    expect(component.updatedProductsData).toEqual([data]);
    expect(component.products.paginator).toEqual(component.paginator);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block')
    expect(component.spin.nativeElement.style.display).toBe('none')
    jest.useRealTimers();
  });

  it('should run discount filter', () => {
    component.spin = new ElementRef({
      style: {
        display: ''
      }
    });
    component.secondary = new ElementRef({
      style: {
        display: ''
      }
    });
    //For data length = 0
    component.productsData = [{ ...data, discountPercentage: 85 }];
    jest.useFakeTimers();
    component.discountFiltering(['10', '20']);
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(true);
    expect(component.updatedProductsData).toEqual([]);
    expect(component.products.paginator).toEqual(component.paginator);
    expect(component.filteredData).toEqual([]);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    jest.useRealTimers();

    //for data
    component.productsData = [{ ...data, discountPercentage: 85 }];
    jest.useFakeTimers();
    component.discountFiltering(['80','90']);
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(false);
    expect(component.updatedProductsData).toEqual([{ ...data, discountPercentage: 85 }]);
    expect(component.products.paginator).toEqual(component.paginator);
    expect(component.filteredData).toEqual([]);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    jest.useRealTimers();
  });

  it('should run sort filtering', () => {
    component.spin = new ElementRef({
      style: {
        display: ''
      }
    });
    component.secondary = new ElementRef({
      style: {
        display: ''
      }
    });
    
    //for category
    //For asc
    //for by-rating
    component.productsData = [{ ...data, category: 'mobile', rating: 5 }, { ...data, category: 'mobile', rating: 4 }, { ...data, category: 'mobile', rating: 3 }];
    jest.useFakeTimers();
    component.sortFiltering('mobile', ['asc', 'By-rating'], null);
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(false);
    expect(component.updatedProductsData).toEqual([{ ...data, category: 'mobile', rating: 5 }, { ...data, category: 'mobile', rating: 4 }, { ...data, category: 'mobile', rating: 3 }]);
    expect(component.products.paginator).toEqual(component.paginator);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    jest.useRealTimers();

    //for by-price
    component.productsData = [{ ...data, category: 'mobile', price: 5, discountPercentage: 23 }, { ...data, category: 'mobile', price: 4, discountPercentage: 20 }, { ...data, category: 'mobile', price: 3, discountPercentage: 12 }];
    jest.useFakeTimers();
    component.sortFiltering('mobile', ['asc', 'By-price'], null);
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(false);
    expect(component.updatedProductsData).toEqual([{ ...data, category: 'mobile', price: 5, discountPercentage: 23 }, { ...data, category: 'mobile', price: 4, discountPercentage: 20 }, { ...data, category: 'mobile', price: 3, discountPercentage: 12 }]);
    expect(component.products.paginator).toEqual(component.paginator);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    jest.useRealTimers();

    //for by-discount
    component.productsData = [{ ...data, category: 'mobile', discountPercentage: 5 }, { ...data, category: 'mobile', discountPercentage: 4 }, { ...data, category: 'mobile', discountPercentage: 3 }];
    jest.useFakeTimers();
    component.sortFiltering('mobile', ['asc', 'By-discount'], null);
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(false);
    expect(component.updatedProductsData).toEqual([{ ...data, category: 'mobile', discountPercentage: 5 }, { ...data, category: 'mobile', discountPercentage: 4 }, { ...data, category: 'mobile', discountPercentage: 3 }]);
    expect(component.products.paginator).toEqual(component.paginator);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    jest.useRealTimers();

    //For dis
    //for by-rating
    component.productsData = [{ ...data, category: 'mobile', rating: 5 }, { ...data, category: 'mobile', rating: 4 }, { ...data, category: 'mobile', rating: 3 }];
    jest.useFakeTimers();
    component.sortFiltering('mobile', ['dis', 'By-rating'], null);
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(false);
    expect(component.updatedProductsData).toEqual([{ ...data, category: 'mobile', rating: 3 }, { ...data, category: 'mobile', rating: 4 }, { ...data, category: 'mobile', rating: 5 }]);
    expect(component.products.paginator).toEqual(component.paginator);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    jest.useRealTimers();

    //for by-price
    component.productsData = [{ ...data, category: 'mobile', price: 5, discountPercentage: 23 }, { ...data, category: 'mobile', price: 4, discountPercentage: 20 }, { ...data, category: 'mobile', price: 3, discountPercentage: 12 }];
    jest.useFakeTimers();
    component.sortFiltering('mobile', ['dis', 'By-price'], null);
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(false);
    expect(component.updatedProductsData).toEqual([{ ...data, category: 'mobile', price: 3, discountPercentage: 12 }, { ...data, category: 'mobile', price: 4, discountPercentage: 20 }, { ...data, category: 'mobile', price: 5, discountPercentage: 23 }]);
    expect(component.products.paginator).toEqual(component.paginator);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    jest.useRealTimers();

    //for by-discount
    component.productsData = [{ ...data, category: 'mobile', discountPercentage: 5 }, { ...data, category: 'mobile', discountPercentage: 4 }, { ...data, category: 'mobile', discountPercentage: 3 }];
    jest.useFakeTimers();
    component.sortFiltering('mobile', ['dis', 'By-discount'], null);
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(false);
    expect(component.updatedProductsData).toEqual([{ ...data, category: 'mobile', discountPercentage: 3 }, { ...data, category: 'mobile', discountPercentage: 4 }, { ...data, category: 'mobile', discountPercentage: 5 }]);
    expect(component.products.paginator).toEqual(component.paginator);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    jest.useRealTimers();

    //for discount
    //For asc
    //for by-rating
    component.productsData = [{ ...data, category: 'mobile', rating: 5, discountPercentage: 10 }, { ...data, category: 'mobile', rating: 4, discountPercentage: 10 }, { ...data, category: 'mobile', rating: 3, discountPercentage: 10}];
    jest.useFakeTimers();
    component.sortFiltering(null, ['asc', 'By-rating'], ['0','100']);
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(false);
    expect(component.updatedProductsData).toEqual([{ ...data, category: 'mobile', rating: 5, discountPercentage: 10 }, { ...data, category: 'mobile', rating: 4, discountPercentage: 10 }, { ...data, category: 'mobile', rating: 3, discountPercentage: 10}]);
    expect(component.products.paginator).toEqual(component.paginator);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    jest.useRealTimers();

    //for both discount and category
    //For asc
    //for by-rating
    component.productsData = [{ ...data, category: 'mobile', rating: 5, discountPercentage: 12 }, { ...data, category: 'mobile', rating: 4, discountPercentage: 12 }, { ...data, category: 'mobile', rating: 3, discountPercentage: 12 }];
    jest.useFakeTimers();
    component.sortFiltering('mobile', ['asc', 'By-rating'], ['10','100']);
    expect(component.spin.nativeElement.style.display).toBe('block');
    expect(component.secondary.nativeElement.style.display).toBe('none');
    jest.advanceTimersByTime(100);
    expect(component.isEmpty).toBe(false);
    expect(component.updatedProductsData).toEqual([{ ...data, category: 'mobile', rating: 5, discountPercentage: 12 }, { ...data, category: 'mobile', rating: 4, discountPercentage: 12 }, { ...data, category: 'mobile', rating: 3, discountPercentage: 12 }]);
    expect(component.products.paginator).toEqual(component.paginator);
    jest.advanceTimersByTime(1000);
    expect(component.secondary.nativeElement.style.display).toBe('block');
    expect(component.spin.nativeElement.style.display).toBe('none');
    jest.useRealTimers();
  });
});
