import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdonnanceEditComponent } from './ordonnance-edit.component';

describe('OrdonnanceEditComponent', () => {
  let component: OrdonnanceEditComponent;
  let fixture: ComponentFixture<OrdonnanceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdonnanceEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdonnanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
