import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LibrariesContributorsComponent } from './libraries-contributors.component';

describe('LibrariesContributorsComponent', () => {
  let component: LibrariesContributorsComponent;
  let fixture: ComponentFixture<LibrariesContributorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LibrariesContributorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrariesContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
