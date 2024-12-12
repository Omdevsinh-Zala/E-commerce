import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountComponent } from './discount.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule, MatRadioGroup } from '@angular/material/radio';

describe('DiscountComponent', () => {
  let component: DiscountComponent;
  let fixture: ComponentFixture<DiscountComponent>;
  const mockActivatedRoute = {
    params: of({ id: '1' }),
    queryParams: of({ sort: 'asc' }),
    snapshot: { paramMap: { get: (key: string) => '1' } },
  };
  let router: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscountComponent],
      imports: [MatRadioModule, ReactiveFormsModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscountComponent);
    router = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
