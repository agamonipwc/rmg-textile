import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SewingmodulehistComponent } from './sewingmodulehist.component';

describe('SewingmodulehistComponent', () => {
  let component: SewingmodulehistComponent;
  let fixture: ComponentFixture<SewingmodulehistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SewingmodulehistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SewingmodulehistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
