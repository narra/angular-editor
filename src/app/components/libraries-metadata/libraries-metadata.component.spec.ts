import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrariesMetadataComponent } from './libraries-metadata.component';

describe('LibrariesMetadataComponent', () => {
  let component: LibrariesMetadataComponent;
  let fixture: ComponentFixture<LibrariesMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibrariesMetadataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrariesMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
