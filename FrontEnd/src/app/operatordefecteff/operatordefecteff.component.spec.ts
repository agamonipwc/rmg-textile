import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatordefecteffComponent } from './operatordefecteff.component';

describe('OperatordefecteffComponent', () => {
  let component: OperatordefecteffComponent;
  let fixture: ComponentFixture<OperatordefecteffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatordefecteffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatordefecteffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
