import { Utilisateur } from "./utilisateur";

export class Notification {
    public id?: number;
    public message: string;
    public lu?: boolean;
    public dateEnvoi: Date;
    public utilisateur: Utilisateur;

    
    constructor(){
        this.message = "";
        this.dateEnvoi = new Date()
        this.utilisateur = new Utilisateur();
    }
}