import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlinewipoperatorComponent } from './inlinewipoperator.component';

describe('InlinewipoperatorComponent', () => {
  let component: InlinewipoperatorComponent;
  let fixture: ComponentFixture<InlinewipoperatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlinewipoperatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlinewipoperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
