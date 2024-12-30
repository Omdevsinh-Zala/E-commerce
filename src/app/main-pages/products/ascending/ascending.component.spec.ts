import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AscendingComponent } from './ascending.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioModule,
} from '@angular/material/radio';
import { input, InputSignal } from '@angular/core';

describe('AscendingComponent', () => {
  let component: AscendingComponent;
  let fixture: ComponentFixture<AscendingComponent>;
  let value: InputSignal<string[]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AscendingComponent],
      imports: [MatRadioModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AscendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect chnages and run some functiona', () => {
    component.ascendingForm.setValue = jest.fn();
    //For recentevalue.lenght == 0
    TestBed.runInInjectionContext(() => {
      value = input<string[]>([]) as unknown as InputSignal<string[]>;
    });
    component.recentValue = value;
    component.ngOnChanges();
    expect(component.ascendingForm.setValue).toHaveBeenCalledWith(null);

    //For length greater than 0 and [2] == undefined
    TestBed.runInInjectionContext(() => {
      value = input<string[]>(['', '']) as unknown as InputSignal<string[]>;
    });
    component.recentValue = value;
    component.ngOnChanges();
    expect(component.ascendingForm.setValue).toHaveBeenCalledWith(null);

    //For fullfilling all conditions
    TestBed.runInInjectionContext(() => {
      value = input<string[][]>([
        [],
        [],
        ['asc', 'By-rating'],
      ]) as unknown as InputSignal<string[]>;
    });
    component.recentValue = value;
    component.ngOnChanges();
    expect(component.ascendingForm.setValue).toHaveBeenCalledWith(null);
    expect(component.ascendingForm.setValue).toHaveBeenCalledWith(
      value()[2][1]
    );
  });

  it('should change value in query parameter', () => {
    component['router'].navigate = jest.fn();
    component.temporarySignal.emit = jest.fn();
    component.ascendingValue.emit = jest.fn();
    const button = document.createElement(
      'MatRadioButton'
    ) as unknown as MatRadioButton;
    const change = new MatRadioChange(button, 'some');
    component.changeValue(change);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/products'], {
      queryParams: { sort: ['asc', change.value] },
      queryParamsHandling: 'merge',
    });
    expect(component.temporarySignal.emit).toHaveBeenCalledWith(false);
    expect(component.ascendingValue.emit).toHaveBeenCalledWith(change.value);
  });

  it('should clear values', () => {
    component.ascendingForm.setValue = jest.fn();
    component['router'].navigate = jest.fn();
    component.clearButton();
    expect(component.ascendingForm.setValue).toHaveBeenCalledWith(null);
    expect(component['router'].navigate).toHaveBeenCalledWith([], {
      queryParams: { sort: null },
      queryParamsHandling: 'merge',
    });
  });
});
