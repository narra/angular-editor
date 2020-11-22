import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateProjectWizardComponent } from './create-project-wizard.component';

describe('CreateProjectWizardComponent', () => {
  let component: CreateProjectWizardComponent;
  let fixture: ComponentFixture<CreateProjectWizardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProjectWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
