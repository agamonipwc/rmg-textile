import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleperformanceComponent } from './moduleperformance.component';

describe('ModuleperformanceComponent', () => {
  let component: ModuleperformanceComponent;
  let fixture: ComponentFixture<ModuleperformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleperformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleperformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
