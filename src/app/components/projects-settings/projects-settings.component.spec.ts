import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectsSettingsComponent } from './projects-settings.component';

describe('ProjectsSettingsComponent', () => {
  let component: ProjectsSettingsComponent;
  let fixture: ComponentFixture<ProjectsSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
