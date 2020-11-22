import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LibrariesSettingsComponent } from './libraries-settings.component';

describe('LibrariesSettingsComponent', () => {
  let component: LibrariesSettingsComponent;
  let fixture: ComponentFixture<LibrariesSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LibrariesSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrariesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
