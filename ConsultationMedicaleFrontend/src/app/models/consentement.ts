import { Document } from "./document";
import { Medecin } from "./medecin";
import { Patient } from "./patient";

export class Consentement {
    public id?: number;
    public date!: Date | string;
    public statut?: StatutConsentement;
    public patient: Patient;
    public medecin: Medecin;
    
    constructor(){
        this.patient = new Patient();
        this.medecin = new Medecin();
    }
}

export enum StatutConsentement {
    EN_ATTENTE = "EN_ATTENTE",
    ACCEPTER = "ACCEPTER",
    REFUSER = "REFUSER",
}
