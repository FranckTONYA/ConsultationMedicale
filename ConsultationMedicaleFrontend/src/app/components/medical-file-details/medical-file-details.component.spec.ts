import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFileDetailsComponent } from './medical-file-details.component';

describe('MedicalFileDetailsComponent', () => {
  let component: MedicalFileDetailsComponent;
  let fixture: ComponentFixture<MedicalFileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalFileDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
