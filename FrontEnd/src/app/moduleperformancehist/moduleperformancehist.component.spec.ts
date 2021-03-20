import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleperformancehistComponent } from './moduleperformancehist.component';

describe('ModuleperformancehistComponent', () => {
  let component: ModuleperformancehistComponent;
  let fixture: ComponentFixture<ModuleperformancehistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleperformancehistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleperformancehistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
