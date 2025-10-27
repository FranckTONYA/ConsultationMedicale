import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMedecinComponent } from './register-medecin.component';

describe('RegisterMedecinComponent', () => {
  let component: RegisterMedecinComponent;
  let fixture: ComponentFixture<RegisterMedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterMedecinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
