import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepoResultPage } from './depo-result.page';

describe('DepoResultPage', () => {
  let component: DepoResultPage;
  let fixture: ComponentFixture<DepoResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepoResultPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepoResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
