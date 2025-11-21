import { Document } from "./document";
import { Medecin } from "./medecin";
import { Patient } from "./patient";

export class Ordonnance {
    public id?: number;
    public date: Date;
    public contenu: string;
    public medecin: Medecin;
    public patient: Patient;
    public documents: Document[];

    
    constructor(){
        this.date = new Date();
        this.contenu = "";
        this.medecin = new Medecin();
        this.patient = new Patient();
        this.documents = [];
    }
}