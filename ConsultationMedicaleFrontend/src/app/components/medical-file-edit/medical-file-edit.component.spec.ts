import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFileEditComponent } from './medical-file-edit.component';

describe('MedicalFileEditComponent', () => {
  let component: MedicalFileEditComponent;
  let fixture: ComponentFixture<MedicalFileEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalFileEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
