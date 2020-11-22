import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateLibraryWizardComponent } from './create-library-wizard.component';

describe('CreateLibraryWizardComponent', () => {
  let component: CreateLibraryWizardComponent;
  let fixture: ComponentFixture<CreateLibraryWizardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLibraryWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLibraryWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
