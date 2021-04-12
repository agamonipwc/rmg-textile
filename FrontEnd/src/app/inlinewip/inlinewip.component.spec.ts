import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlinewipComponent } from './inlinewip.component';

describe('InlinewipComponent', () => {
  let component: InlinewipComponent;
  let fixture: ComponentFixture<InlinewipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlinewipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlinewipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
