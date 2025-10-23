import { Medecin } from "./medecin";
import { Patient } from "./patient";

export class AnalyseLabo {
    public id?: number;
    public titre: string;
    public resultat: string;
    public date: Date;
    public patient: Patient;
    public medecin: Medecin;
    
    constructor(){
        this.id ;
        this.titre = "";
        this.resultat = "";
        this.date = new Date();
        this.patient = new Patient();
        this.medecin = new Medecin();
    }

}
