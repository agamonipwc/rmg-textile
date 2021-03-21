import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SewingmoduleComponent } from './sewingmodule.component';

describe('SewingmoduleComponent', () => {
  let component: SewingmoduleComponent;
  let fixture: ComponentFixture<SewingmoduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SewingmoduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SewingmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
