import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountComponent } from './discount.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioButton, MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { input, InputSignal } from '@angular/core';

describe('DiscountComponent', () => {
  let component: DiscountComponent;
  let fixture: ComponentFixture<DiscountComponent>;
  const mockActivatedRoute = {
    params: of({ id: '1' }),
    queryParams: of({ sort: 'asc' }),
    snapshot: { paramMap: { get: () => '1' } },
  };
  let data: InputSignal<string[]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscountComponent],
      imports: [MatRadioModule, ReactiveFormsModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.radioForm.setValue = jest.fn();
    component['router'].navigate = jest.fn();
    component.temprarySignal.emit = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run functions on ngChanges', () => {
    //for length == 0 or [2] == undefined
    TestBed.runInInjectionContext(() => {
      data = input<string[][]>(
        []
      ) as unknown as InputSignal<string[]>
    });
    component.recentValue = data;
    component.ngOnChanges();
    expect(component.radioForm.setValue).toHaveBeenCalledWith(null);
    
    //For all condition true
    TestBed.runInInjectionContext(() => {
      data = input<string[][]>(
        [['0','10'],['10','20']]
      ) as unknown as InputSignal<string[]>
    });
    component.recentValue = data;
    component.ngOnChanges();
    expect(component.radioForm.setValue).toHaveBeenCalledWith(null);
    expect(component.radioForm.setValue).toHaveBeenCalledWith(component.disconts[1]);
  })

  it('should change discount', () => {
    const button = '' as unknown as MatRadioButton;
    const change = new MatRadioChange(button, '');
    component.ChangeDiscount(change);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/products'], {
      queryParams: { discount: change.value },
      queryParamsHandling: 'merge',
    });
    expect(component.temprarySignal.emit).toHaveBeenCalledWith(false);
  })

  it('should clear discount properly', () => {
    component.clearDiscount();
    expect(component.radioForm.setValue).toHaveBeenCalledWith(null);
    expect(component['router'].navigate).toHaveBeenCalledWith([], {
      queryParams: { discount: null },
      queryParamsHandling: 'merge',
    });
    expect(component.temprarySignal.emit).toHaveBeenCalledWith(false)
  })
});
