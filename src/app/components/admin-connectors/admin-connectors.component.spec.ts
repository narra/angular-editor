import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminConnectorsComponent } from './admin-connectors.component';

describe('AdminConnectorsComponent', () => {
  let component: AdminConnectorsComponent;
  let fixture: ComponentFixture<AdminConnectorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminConnectorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConnectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
