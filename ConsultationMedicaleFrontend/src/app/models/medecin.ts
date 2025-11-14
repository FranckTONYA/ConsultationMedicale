import { Consultation } from "./consultation";
import { Patient } from "./patient";
import { PlanningMedecin } from "./planning-medecin";
import { Utilisateur } from "./utilisateur";

export class Medecin extends Utilisateur{
    public specialite: string;
    public numINAMI: string;
    public consultations: Consultation[];
    public patients: Patient[];
    public plannings: PlanningMedecin[];
    
    constructor(){
        super();
        this.specialite = "";
        this.numINAMI = "";
        this.consultations = [];
        this.patients = [];
        this.plannings = [];
    }

}
