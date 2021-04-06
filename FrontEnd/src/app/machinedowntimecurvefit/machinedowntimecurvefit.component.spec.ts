import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinedowntimecurvefitComponent } from './machinedowntimecurvefit.component';

describe('MachinedowntimecurvefitComponent', () => {
  let component: MachinedowntimecurvefitComponent;
  let fixture: ComponentFixture<MachinedowntimecurvefitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinedowntimecurvefitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinedowntimecurvefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
