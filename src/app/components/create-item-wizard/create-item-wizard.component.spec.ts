import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateItemWizardComponent } from './create-item-wizard.component';

describe('CreateItemWizardComponent', () => {
  let component: CreateItemWizardComponent;
  let fixture: ComponentFixture<CreateItemWizardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateItemWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
