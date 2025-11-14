import { TestBed } from '@angular/core/testing';

import { PlanningMedecinService } from './planning-medecin.service';

describe('PlanningMedecinService', () => {
  let service: PlanningMedecinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanningMedecinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
