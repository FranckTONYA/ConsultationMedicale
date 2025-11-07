import { Consultation } from "./consultation";
import { DossierMedical } from "./dossier-medical";
import { Medecin } from "./medecin";
import { Utilisateur } from "./utilisateur";

export class Patient extends Utilisateur{
    public niss: string;
    public dateNaissance: Date;
    public dossierMedical?: DossierMedical;
    public medecin?: Medecin;
    public consultations: Consultation[];
    
    constructor(){
        super();
        this.niss = "";
        this.dateNaissance = new Date();
        this.consultations = [];
    }
}
