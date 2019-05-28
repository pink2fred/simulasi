import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistKrdPage } from './hist-krd.page';

describe('HistKrdPage', () => {
  let component: HistKrdPage;
  let fixture: ComponentFixture<HistKrdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistKrdPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistKrdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
