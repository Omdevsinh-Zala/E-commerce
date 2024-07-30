import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AscendingComponent } from './ascending.component';

describe('AscendingComponent', () => {
  let component: AscendingComponent;
  let fixture: ComponentFixture<AscendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AscendingComponent]
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
