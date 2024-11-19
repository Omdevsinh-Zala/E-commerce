import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AscendingComponent } from './ascending.component';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

describe('AscendingComponent', () => {
  let component: AscendingComponent;
  let fixture: ComponentFixture<AscendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AscendingComponent],
      imports:[
        MatRadioModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AscendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
