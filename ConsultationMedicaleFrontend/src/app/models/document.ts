import { Consultation } from "./consultation";
import { Medecin } from "./medecin";
import { Ordonnance } from "./ordonnance";
import { Patient } from "./patient";

export class Document {
    public id?: number;
    public nom: string;
    public urlStockage: string;
    public type?: TypeDoc | string;
    public consultation?: Consultation;
    public ordonnance?: Ordonnance;
    
    constructor(){
        this.nom = "";
        this.urlStockage = "";
        this.consultation = new Consultation();
        this.ordonnance = new Ordonnance();
    }
}

export enum TypeDoc {
    PDF = 'PDF',
    IMAGE ='IMAGE',
    TEXT = 'IMAGE'
}
