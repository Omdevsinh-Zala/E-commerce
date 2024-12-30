import { TestBed } from '@angular/core/testing';

import { TitleService } from './title.service';
import 'zone.js';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('TitleService', () => {
  let service: TitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
