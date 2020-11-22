import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScenariosDashboardComponent } from './scenarios-dashboard.component';

describe('ScenariosDashboardComponent', () => {
  let component: ScenariosDashboardComponent;
  let fixture: ComponentFixture<ScenariosDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenariosDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenariosDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
