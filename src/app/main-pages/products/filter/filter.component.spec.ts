import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { provideHttpClient } from '@angular/common/http';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[
        provideHttpClient()
      ],
      declarations: [FilterComponent],
      imports:[
        MatRadioModule,
        MatRadioGroup,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
