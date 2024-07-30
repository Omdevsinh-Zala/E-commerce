import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRouterComponent } from './main-router.component';

describe('MainRouterComponent', () => {
  let component: MainRouterComponent;
  let fixture: ComponentFixture<MainRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainRouterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
