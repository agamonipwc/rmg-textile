import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityutilizationComponent } from './capacityutilization.component';

describe('CapacityutilizationComponent', () => {
  let component: CapacityutilizationComponent;
  let fixture: ComponentFixture<CapacityutilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacityutilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityutilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
