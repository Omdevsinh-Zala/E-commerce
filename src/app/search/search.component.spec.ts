import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { getAuth, provideAuth } from '@angular/fire/auth';
import 'zone.js';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { environment } from './../../environments/environment.development';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../service/user/user.service';
import { ElementRef, input, InputSignal } from '@angular/core';
import { filter, firstValueFrom, from, map, Observable, of, toArray } from 'rxjs';
import { Router } from '@angular/router';
import { Products } from '../service/product/products';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let service: UserService;
  let router: Router;
  let data :InputSignal<Products[]>;
  let productData: Products;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
      ],
      imports: [MatIconModule],
      declarations: [SearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    productData = '' as unknown as Products;
    TestBed.runInInjectionContext(() => {
      data = input<Products[]>([
        {title: 'one', ...productData},
        {title: 'one1', ...productData},
        {title: 'one2', ...productData},
        {title: 'one3', ...productData},
        {title: 'one4', ...productData},
        {title: 'one5', ...productData},
        {title: 'some', ...productData},
        {title: 'extra', ...productData},
      ]) as unknown as InputSignal<Products[]>;
    });
    })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user', async () => {
    service.user$ = of('test') as unknown as Observable<unknown>;
    component.ngOnInit();
    const data = await firstValueFrom(component.account.user$);
    expect(component.user).toBe(data);
  });

  it('should toggle account menu', () => {
    jest.useFakeTimers();
    component.accountInfo = new ElementRef({
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
      },
    });

    //For isShown to be true
    component.isShown = true;
    component.toggleAccount();
    expect(
      component.accountInfo.nativeElement.classList.add
    ).toHaveBeenCalledWith('hide');
    jest.advanceTimersByTime(200);
    expect(
      component.accountInfo.nativeElement.classList.remove
    ).toHaveBeenCalledWith('hide');
    expect(
      component.accountInfo.nativeElement.classList.remove
    ).toHaveBeenCalledWith('toggle');
    expect(component.isShown).toBe(false);

    //For isShown to be false
    component.isShown = false;
    component.toggleAccount();
    expect(
      component.accountInfo.nativeElement.classList.add
    ).toHaveBeenCalledWith('toggle');
    expect(
      component.accountInfo.nativeElement.classList.add
    ).toHaveBeenCalledWith('show');
    jest.advanceTimersByTime(400);
    expect(
      component.accountInfo.nativeElement.classList.remove
    ).toHaveBeenCalledWith('show');
    expect(component.isShown).toBe(true);
    jest.useRealTimers();
  });

  it('should logout user', () => {
    service.logoutUser = jest.fn().mockReturnValue(of({}));
    component.logout();
    expect(service.logoutUser).toHaveBeenCalledWith();
  });

  it('should nevigate to login', () => {
    router.navigate = jest.fn();
    component.login();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display product title on Input', async () => {
    component.product.emit = jest.fn();

    //For null input
    component.search.nativeElement.value = null;
    component.data = data;
    component.onInput();
    expect(component.wrap.nativeElement.style.display).toBe('none');
    const filterData = await firstValueFrom(from(data()).pipe(
      map((e) => e.title),
      toArray()
    ));
    const expected = await firstValueFrom(component.productName);

    expect(expected).toEqual(filterData);
    expect(component.list.nativeElement.style.height).toBe('300px');
    expect(component.span.nativeElement.style.display).toBe('block');
    expect(component.product.emit).toHaveBeenCalled();

    //For one input length greater than 5
    component.search.nativeElement.value = 'one';
    component.onInput();
    expect(component.wrap.nativeElement.style.display).toBe('block');
    expect(component.span.nativeElement.style.display).toBe('none');
    const receviedData = await firstValueFrom(from(data()).pipe(
      map((products) => {
        return products.title;
      }),
      filter((product) => {
        return product
          .toLowerCase()
          .includes(component.search.nativeElement.value.toLowerCase());
      }),
      toArray()
    ));
    const expected1 = await firstValueFrom(component.productName);
    expect(expected1).toEqual(receviedData);
    expect(component.list.nativeElement.style.height).toBe('300px');

    //length less than 5
    component.search.nativeElement.value = 's';
    component.onInput();
    expect(component.wrap.nativeElement.style.display).toBe('block');
    expect(component.span.nativeElement.style.display).toBe('none');
    const receviedData1 = await firstValueFrom(from(data()).pipe(
      map((products) => {
        return products.title;
      }),
      filter((product) => {
        return product
          .toLowerCase()
          .includes(component.search.nativeElement.value.toLowerCase());
      }),
      toArray()
    ));
    const expected2 = await firstValueFrom(component.productName);
    expect(expected2).toEqual(receviedData1);
    expect(component.list.nativeElement.style.height).toBe(`${receviedData1.length * 60}px`);
  })

  it('should blur', () => {
    jest.useFakeTimers();
    component.onBlur();
    jest.advanceTimersByTime(100);
    expect(component.wrap.nativeElement.style.display).toBe('none');
    jest.useRealTimers();
  })

  it('should display product', () => {
    const data = 'string';
    component.product.emit = jest.fn()
    component.displayProduct(data);
    expect(component.search.nativeElement.value).toBe(data);
    expect(component.span.nativeElement.style.display).toBe('none');
    expect(component.product.emit).toHaveBeenCalledWith(data);
  });
});
