import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminSynthesizersComponent } from './admin-synthesizers.component';

describe('AdminSynthesizersComponent', () => {
  let component: AdminSynthesizersComponent;
  let fixture: ComponentFixture<AdminSynthesizersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSynthesizersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSynthesizersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
