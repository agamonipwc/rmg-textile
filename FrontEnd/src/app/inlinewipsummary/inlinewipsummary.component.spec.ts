import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlinewipsummaryComponent } from './inlinewipsummary.component';

describe('InlinewipsummaryComponent', () => {
  let component: InlinewipsummaryComponent;
  let fixture: ComponentFixture<InlinewipsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlinewipsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlinewipsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
