import { Medecin } from "./medecin";

export class PlanningMedecin {
  id?: number;
  medecin?: Medecin;
  startDate!: Date;
  endDate!: Date;
  statut?: StatutPlanning;

  constructor() {
  }
}

export enum StatutPlanning {
    DISPONIBLE = "DISPONIBLE" ,
    INDISPONIBLE = "INDISPONIBLE"
}