import { Consentement } from "./consentement";
import { Consultation } from "./consultation";
import { Patient } from "./patient";
import { PlanningMedecin } from "./planning-medecin";
import { Utilisateur } from "./utilisateur";

export class Medecin extends Utilisateur{
    public specialite: string;
    public numINAMI: string;
    public consultations: Consultation[];
    public plannings: PlanningMedecin[];
    public consentements: Consentement[];
    
    constructor(){
        super();
        this.specialite = "";
        this.numINAMI = "";
        this.consultations = [];
        this.plannings = [];
        this.consentements = [];
    }

}
