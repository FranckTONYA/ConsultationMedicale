import { Document } from "./document";
import { Medecin } from "./medecin";
import { Patient } from "./patient";

export class Consultation {
    public id?: number;
    public dateHeure: Date;
    public compteRendu: string;
    public lienReunion: string;
    public statut?: StatutRDV;
    public patient: Patient;
    public medecin: Medecin;
    public documents: Document[];
    
    constructor(){
        this.dateHeure = new Date();
        this.compteRendu = "";
        this.lienReunion = "";
        this.patient = new Patient();
        this.medecin = new Medecin();
        this.documents = [];
    }
}

export enum StatutRDV {
    EN_ATTENTE,
    CONFIRMER,
    REFUSER,
    ANNULER,
    TERMINER
}
