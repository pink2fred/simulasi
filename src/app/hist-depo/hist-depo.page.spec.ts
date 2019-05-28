import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistDepoPage } from './hist-depo.page';

describe('HistDepoPage', () => {
  let component: HistDepoPage;
  let fixture: ComponentFixture<HistDepoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistDepoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistDepoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
