import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectsContributorsComponent } from './projects-contributors.component';

describe('ProjectsContributorsComponent', () => {
  let component: ProjectsContributorsComponent;
  let fixture: ComponentFixture<ProjectsContributorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsContributorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
