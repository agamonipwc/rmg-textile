import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinedowntimehistComponent } from './machinedowntimehist.component';

describe('MachinedowntimehistComponent', () => {
  let component: MachinedowntimehistComponent;
  let fixture: ComponentFixture<MachinedowntimehistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinedowntimehistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinedowntimehistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
