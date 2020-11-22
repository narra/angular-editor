import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LibrariesMainComponent } from './libraries-main.component';

describe('LibrariesMainComponent', () => {
  let component: LibrariesMainComponent;
  let fixture: ComponentFixture<LibrariesMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LibrariesMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrariesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
