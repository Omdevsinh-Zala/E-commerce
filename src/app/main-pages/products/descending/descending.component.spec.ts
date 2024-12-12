import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescendingComponent } from './descending.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('DescendingComponent', () => {
  let component: DescendingComponent;
  let fixture: ComponentFixture<DescendingComponent>;

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
});
