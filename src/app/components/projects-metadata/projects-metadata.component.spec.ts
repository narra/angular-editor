import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsMetadataComponent } from './projects-metadata.component';

describe('ProjectsMetadataComponent', () => {
  let component: ProjectsMetadataComponent;
  let fixture: ComponentFixture<ProjectsMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsMetadataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
