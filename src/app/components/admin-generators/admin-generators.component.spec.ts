import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminGeneratorsComponent } from './admin-generators.component';

describe('AdminGeneratorsComponent', () => {
  let component: AdminGeneratorsComponent;
  let fixture: ComponentFixture<AdminGeneratorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGeneratorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGeneratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
