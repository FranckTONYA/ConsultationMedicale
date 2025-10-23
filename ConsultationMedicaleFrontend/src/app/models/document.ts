import { Consultation } from "./consultation";
import { Medecin } from "./medecin";
import { Patient } from "./patient";

export class Document {
    public id?: number;
    public nom: string;
    public urlStockage: string;
    public type?: TypeDoc;
    public consultation: Consultation;
    
    constructor(){
        this.nom = "";
        this.urlStockage = "";
        this.consultation = new Consultation();
    }
}

export enum TypeDoc {
    PDF,
    IMAGE,
    VIDEO
}
