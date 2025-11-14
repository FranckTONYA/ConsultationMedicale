import { Medecin } from "./medecin";

export class PlanningMedecin {
  id?: number;
  medecin?: Medecin;
  start: string;
  end: string;
  statut?: StatutPlanning;

  constructor() {
    this.start = "";
    this.end = "";
  }
}

export enum StatutPlanning {
    DISPONIBLE,
    INDISPONIBLE
}