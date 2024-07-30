import { TestBed } from '@angular/core/testing';

import { CartBadgeService } from './cart-badge.service';

describe('CartBadgeService', () => {
  let service: CartBadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartBadgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
