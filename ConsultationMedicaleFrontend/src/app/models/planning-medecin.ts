import { Medecin } from "./medecin";

export class PlanningMedecin {
  id?: number;
  medecin?: Medecin;
  startDate!: Date | string;
  endDate!: Date | string;
  statut?: StatutPlanning;

  constructor() {
  }
}

export enum StatutPlanning {
    DISPONIBLE = "DISPONIBLE" ,
    INDISPONIBLE = "INDISPONIBLE"
}