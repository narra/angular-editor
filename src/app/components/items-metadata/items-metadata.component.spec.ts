import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsMetadataComponent } from './items-metadata.component';

describe('ItemsMetadataComponent', () => {
  let component: ItemsMetadataComponent;
  let fixture: ComponentFixture<ItemsMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsMetadataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
