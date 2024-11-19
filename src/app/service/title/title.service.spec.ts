import { TestBed } from '@angular/core/testing';

import { TitleService } from './title.service';
import 'zone.js';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';

describe('TitleService', () => {
  let service: TitleService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TitleService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set title', async() => {
    const router = { paramMap:{ id: 1 } } as unknown as ActivatedRouteSnapshot;
    // const title$ = service.resolve(router);
    // const promise = firstValueFrom(title$);
    // const req = httpTesting.expectOne('https://dummyjson.com/products?limit=0')
  })
});
