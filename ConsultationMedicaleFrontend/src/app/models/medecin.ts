import { Consultation } from "./consultation";
import { Utilisateur } from "./utilisateur";

export class Medecin extends Utilisateur{
    public specialite: string;
    public numINAMI: string;
    public consultations: Consultation[];
    
    constructor(){
        super();
        this.specialite = "";
        this.numINAMI = "";
        this.consultations = [];
    }

}
