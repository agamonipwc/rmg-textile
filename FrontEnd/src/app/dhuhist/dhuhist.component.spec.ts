import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DhuhistComponent } from './dhuhist.component';

describe('DhuhistComponent', () => {
  let component: DhuhistComponent;
  let fixture: ComponentFixture<DhuhistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DhuhistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DhuhistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
