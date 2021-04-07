import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DhuComponent } from './dhu.component';

describe('DhuComponent', () => {
  let component: DhuComponent;
  let fixture: ComponentFixture<DhuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DhuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DhuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
