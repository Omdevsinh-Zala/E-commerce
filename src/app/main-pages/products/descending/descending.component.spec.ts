import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescendingComponent } from './descending.component';
import { MatRadioButton, MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { input, InputSignal } from '@angular/core';

describe('DescendingComponent', () => {
  let component: DescendingComponent;
  let fixture: ComponentFixture<DescendingComponent>;
  let data: InputSignal<string[]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescendingComponent],
      imports: [MatRadioModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DescendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run changes on ngChanges', () => {
    component.descendingForm.setValue = jest.fn();
    //For length == 0
    TestBed.runInInjectionContext(() => {
      data = input<string[][]>(
        []
      ) as unknown as InputSignal<string[]>;
    });
    component.recentValue = data;
    component.ngOnChanges();
    expect(component.descendingForm.setValue).toHaveBeenCalledWith(null);
    
    //For [2] == undefiend
    TestBed.runInInjectionContext(() => {
      data = input<string[][]>(
        []
      ) as unknown as InputSignal<string[]>;
    });
    component.recentValue = data;
    component.ngOnChanges();
    expect(component.descendingForm.setValue).toHaveBeenCalledWith(null);

    //For all condition true
    TestBed.runInInjectionContext(() => {
      data = input<string[][]>(
        [[''],[''],['des','some']]
      ) as unknown as InputSignal<string[]>;
      component.recentValue = data;
    component.ngOnChanges();
    expect(component.descendingForm.setValue).toHaveBeenCalledWith(null);
    expect(component.descendingForm.setValue).toHaveBeenCalledWith(data()[2][1]);
    });
  })

  it('should change value', () => {
    component['router'].navigate = jest.fn();
    component.temporarySignal.emit = jest.fn();
    component.descendingValue.emit = jest.fn();
    const button = '' as unknown as MatRadioButton;
    const change = new MatRadioChange(button, 'some');
    component.changeDescendingValue(change);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/products'], {
      queryParams: { sort: ['des', change.value] },
      queryParamsHandling: 'merge',
    });
    expect(component.temporarySignal.emit).toHaveBeenCalledWith(false);
    expect(component.descendingValue.emit).toHaveBeenCalledWith(change.value);
  })

  it('should clearbutton function work', () => {
    component['router'].navigate = jest.fn();
    component.descendingForm.setValue = jest.fn();
    component.clearButton();
    expect(component.descendingForm.setValue).toHaveBeenCalledWith(null);
    expect(component['router'].navigate).toHaveBeenCalledWith([], {
      queryParams: { sort: null },
      queryParamsHandling: 'merge',
    })
  })
});
