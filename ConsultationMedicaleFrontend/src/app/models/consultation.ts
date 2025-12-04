import { Document } from "./document";
import { Medecin } from "./medecin";
import { Patient } from "./patient";

export class Consultation {
    public id?: number;
    public debut!: Date | string;
    public fin!: Date | string;
    public compteRendu: string;
    public lienReunion: string;
    public statut?: StatutRDV;
    public patient: Patient;
    public medecin: Medecin;
    public documents: Document[];
    
    constructor(){
        this.compteRendu = "";
        this.lienReunion = "";
        this.patient = new Patient();
        this.medecin = new Medecin();
        this.documents = [];
    }
}

export enum StatutRDV {
    EN_ATTENTE = "EN_ATTENTE",
    CONFIRMER = "CONFIRMER",
    REFUSER = "REFUSER",
    ANNULER = "ANNULER",
    TERMINER = "TERMINER"
}

export function getLabelStatut(statut: StatutRDV): string {
  switch (statut) {
    case StatutRDV.EN_ATTENTE: return "En attente";
    case StatutRDV.CONFIRMER: return "Confirmée";
    case StatutRDV.REFUSER: return "Refusée";
    case StatutRDV.ANNULER: return "Annulée";
    case StatutRDV.TERMINER: return "Terminée";
    default: return statut;
  }
}

export function getLabelRDV(statut: StatutRDV): string {
  switch (statut) {
    case StatutRDV.EN_ATTENTE: return "En attente";
    case StatutRDV.CONFIRMER: return "Confirmé";
    case StatutRDV.REFUSER: return "Refusé";
    case StatutRDV.ANNULER: return "Annulé";
    case StatutRDV.TERMINER: return "Terminé";
    default: return statut;
  }
}

