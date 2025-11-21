import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdonnanceDetailsComponent } from './ordonnance-details.component';

describe('OrdonnanceDetailsComponent', () => {
  let component: OrdonnanceDetailsComponent;
  let fixture: ComponentFixture<OrdonnanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdonnanceDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdonnanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
