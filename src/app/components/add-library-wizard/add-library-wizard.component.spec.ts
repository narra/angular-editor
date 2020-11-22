import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLibraryWizardComponent } from './add-library-wizard.component';

describe('AddLibraryWizardComponent', () => {
  let component: AddLibraryWizardComponent;
  let fixture: ComponentFixture<AddLibraryWizardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLibraryWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLibraryWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
