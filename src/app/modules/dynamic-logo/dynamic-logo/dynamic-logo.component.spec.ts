import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLogoComponent } from './dynamic-logo.component';

describe('DynamicLogoComponent', () => {
  let component: DynamicLogoComponent;
  let fixture: ComponentFixture<DynamicLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
