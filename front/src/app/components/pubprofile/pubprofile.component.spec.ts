import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubprofileComponent } from './pubprofile.component';

describe('PubprofileComponent', () => {
  let component: PubprofileComponent;
  let fixture: ComponentFixture<PubprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
