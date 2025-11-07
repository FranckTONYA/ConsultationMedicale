import { Consultation } from "./consultation";
import { Patient } from "./patient";
import { Utilisateur } from "./utilisateur";

export class Medecin extends Utilisateur{
    public specialite: string;
    public numINAMI: string;
    public consultations: Consultation[];
    public patients: Patient[];
    
    constructor(){
        super();
        this.specialite = "";
        this.numINAMI = "";
        this.consultations = [];
        this.patients = [];
    }

}
