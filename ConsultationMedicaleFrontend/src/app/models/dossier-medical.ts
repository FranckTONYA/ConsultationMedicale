import { Patient } from "./patient";

export class DossierMedical {
    public id?: number;
    public groupeSanguin: string;
    public allergies: string[];
    public vaccinations: string[];
    public antecedentsMedicaux: string[];
    public remarques: string[];
    public patient: Patient;
    
    constructor(){
        this.groupeSanguin = "";
        this.allergies = [];
        this.vaccinations = [];
        this.antecedentsMedicaux = [];
        this.remarques = [];
        this.patient = new Patient();
    }

}
