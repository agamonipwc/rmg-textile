import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsentismComponent } from './absentism.component';

describe('AbsentismComponent', () => {
  let component: AbsentismComponent;
  let fixture: ComponentFixture<AbsentismComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsentismComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsentismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
