import { TestBed } from '@angular/core/testing';

import { PreviousUrlService } from './previous-url.service';
import 'zone.js';

describe('PreviousUrlService', () => {
  let service: PreviousUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviousUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
