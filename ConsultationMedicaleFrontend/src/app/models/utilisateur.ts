export class Utilisateur{
    public id?: number;
    public nom: string;
    public prenom: string;
    public adresse: string;
    public telephone: string;
    public email: string;
    public motDePasse: string;
    public role?: RoleUtilisateur;

    constructor(){
        this.nom = "";
        this.prenom = "";
        this.adresse = "";
        this.telephone = "";
        this.email = "";
        this.motDePasse = "";
    }
}

export enum RoleUtilisateur {
    PATIENT,
    MEDECIN,
    ADMINISTRATEUR
}