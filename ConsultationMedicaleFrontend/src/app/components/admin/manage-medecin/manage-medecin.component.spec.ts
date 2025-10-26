import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMedecinComponent } from './manage-medecin.component';

describe('ManageMedecinComponent', () => {
  let component: ManageMedecinComponent;
  let fixture: ComponentFixture<ManageMedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageMedecinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
