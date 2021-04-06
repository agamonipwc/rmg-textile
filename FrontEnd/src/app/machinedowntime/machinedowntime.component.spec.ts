import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinedowntimeComponent } from './machinedowntime.component';

describe('MachinedowntimeComponent', () => {
  let component: MachinedowntimeComponent;
  let fixture: ComponentFixture<MachinedowntimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinedowntimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinedowntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
