import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorConsentComponent } from './doctor-consent.component';

describe('DoctorConsentComponent', () => {
  let component: DoctorConsentComponent;
  let fixture: ComponentFixture<DoctorConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorConsentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
