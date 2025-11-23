import { Document } from "./document";
import { Utilisateur } from "./utilisateur";

export class Message {
    public id?: number;
    public contenu: string;
    public lu?: boolean;
    public dateEnvoi: Date;
    public emetteurId?: number;
    public recepteurId?: number;
    public emetteur: Utilisateur;
    public recepteur: Utilisateur;
    public document?: Document;

    
    constructor(){
        this.contenu = "";
        this.dateEnvoi = new Date();
        this.emetteur = new Utilisateur();
        this.recepteur = new Utilisateur();
    }
}
