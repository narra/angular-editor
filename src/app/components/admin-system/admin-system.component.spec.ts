import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminSystemComponent } from './admin-system.component';

describe('AdminSystemComponent', () => {
  let component: AdminSystemComponent;
  let fixture: ComponentFixture<AdminSystemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
