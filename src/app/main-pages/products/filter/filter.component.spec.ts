import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { provideHttpClient } from '@angular/common/http';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { input, InputSignal } from '@angular/core';
import { of } from 'rxjs';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let data: InputSignal<string[]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient()],
      declarations: [FilterComponent],
      imports: [MatRadioModule, MatRadioGroup, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component['router'].navigate = jest.fn();
    component.categoryForm.setValue = jest.fn();
    component.temprarySignal.emit = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change value on any changes', () => {
    TestBed.runInInjectionContext(() => {
      data = input<string[][]>([['mobile'], [], []]) as unknown as InputSignal<
        string[]
      >;
    });
    component.recentValue = data;
    component.ngOnChanges();
    expect(component.categoryForm.setValue).toHaveBeenCalledWith(data()[0]);
  });

  it('should run ngOnInit', () => {
    component.getCategories = jest.fn();
    component.ngOnInit();
    expect(component.getCategories).toHaveBeenCalled();
  });

  it('should change category', () => {
    component.changeCategory();
    expect(component.temprarySignal.emit).toHaveBeenCalledWith(false);
  });

  it('should clear category', () => {
    component.clearButton();
    expect(component.categoryForm.setValue).toHaveBeenCalledWith(null);
    expect(component['router'].navigate).toHaveBeenCalledWith([], {
      queryParams: { Category: null },
      queryParamsHandling: 'merge',
    });
  });

  it('should getCategories', () => {
    const data = ['1','2','3'];
    component['api'].categotriesLists = jest.fn().mockReturnValue(of(data));
    jest.useFakeTimers();
    component.getCategories();
    jest.advanceTimersByTime(200);
    expect(component.categories).toEqual(data);
    jest.useRealTimers();
  })
});
