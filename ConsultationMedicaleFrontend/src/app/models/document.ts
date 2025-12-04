import { Consultation } from "./consultation";
import { DossierMedical } from "./dossier-medical";
import { Message } from "./message";
import { Ordonnance } from "./ordonnance";

export class Document {
    public id?: number;
    public nom: string;
    public urlStockage: string;
    public type?: TypeDoc | string;
    public consultation?: Consultation;
    public ordonnance?: Ordonnance;
    public message?: Message;
    public dossierMedical?: DossierMedical;
    
    constructor(){
        this.nom = "";
        this.urlStockage = "";
        this.consultation = new Consultation();
        this.ordonnance = new Ordonnance();
        this.message = new Message();
        this.dossierMedical = new DossierMedical();
    }
}

export enum TypeDoc {
    PDF = 'PDF',
    IMAGE ='IMAGE',
    TEXT = 'IMAGE'
}
