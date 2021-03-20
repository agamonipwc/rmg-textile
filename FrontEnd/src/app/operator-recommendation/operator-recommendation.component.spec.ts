import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorRecommendationComponent } from './operator-recommendation.component';

describe('OperatorRecommendationComponent', () => {
  let component: OperatorRecommendationComponent;
  let fixture: ComponentFixture<OperatorRecommendationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorRecommendationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
