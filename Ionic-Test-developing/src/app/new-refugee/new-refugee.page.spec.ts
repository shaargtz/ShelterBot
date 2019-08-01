import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRefugeePage } from './new-refugee.page';

describe('NewRefugeePage', () => {
  let component: NewRefugeePage;
  let fixture: ComponentFixture<NewRefugeePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRefugeePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRefugeePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
