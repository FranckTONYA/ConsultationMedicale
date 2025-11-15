import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleConsultComponent } from './schedule-consult.component';

describe('ScheduleConsultComponent', () => {
  let component: ScheduleConsultComponent;
  let fixture: ComponentFixture<ScheduleConsultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleConsultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
