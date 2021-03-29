import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiskillComponent } from './multiskill.component';

describe('MultiskillComponent', () => {
  let component: MultiskillComponent;
  let fixture: ComponentFixture<MultiskillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiskillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiskillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
