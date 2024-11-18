import { TestBed } from '@angular/core/testing';

import { TitleService } from './title.service';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import 'zone.js';
import { provideHttpClient } from '@angular/common/http';

describe('TitleService', () => {
  let service: TitleService;

  beforeEach(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient()
      ]
    });
    service = TestBed.inject(TitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
