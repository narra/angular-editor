import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LibrariesDashboardComponent } from './libraries-dashboard.component';

describe('LibrariesDashboardComponent', () => {
  let component: LibrariesDashboardComponent;
  let fixture: ComponentFixture<LibrariesDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LibrariesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrariesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
