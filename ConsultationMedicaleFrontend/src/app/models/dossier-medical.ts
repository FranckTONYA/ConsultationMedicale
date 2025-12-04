import { Document } from "./document";
import { Patient } from "./patient";

export class DossierMedical {
    public id?: number;
    public date!: Date | string;
    public groupeSanguin: string;
    public allergies: string[];
    public vaccinations: string[];
    public antecedentsMedicaux: string[];
    public remarques: string[];
    public patient: Patient;
    public documents: Document[];
    
    constructor(){
        this.groupeSanguin = "";
        this.allergies = [];
        this.vaccinations = [];
        this.antecedentsMedicaux = [];
        this.remarques = [];
        this.patient = new Patient();
        this.documents = [];
    }

}
