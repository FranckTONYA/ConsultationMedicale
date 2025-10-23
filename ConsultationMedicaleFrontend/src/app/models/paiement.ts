import { Consultation } from "./consultation";
import { Patient } from "./patient";

export class Paiement {
    public id?: number;
    public montant: number;
    public devise: string;
    public date: Date;
    public statut?: StatutPaiement;
    public patient: Patient;
    public consultation: Consultation;

    
    constructor(){
        this.montant = 0;
        this.devise = "";
        this.date = new Date();
        this.patient = new Patient();
        this.consultation = new Consultation();
    }
}

export enum StatutPaiement {
    EN_ATTENTE,
    PAYER,
    ECHOUER,
    ANNULER
}
