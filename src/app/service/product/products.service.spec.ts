import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import 'zone.js';
import { provideHttpClient } from '@angular/common/http';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    TestBed.configureTestingModule({
      providers:[provideHttpClient()]
    });
    service = TestBed.inject(ProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
