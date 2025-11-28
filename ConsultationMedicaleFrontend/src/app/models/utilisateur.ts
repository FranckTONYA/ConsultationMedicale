export class Utilisateur{
    public id?: number;
    public nom: string;
    public prenom: string;
    public sexe?: Sexe;
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
    PATIENT = 'PATIENT',
    MEDECIN = 'MEDECIN',
    ADMINISTRATEUR = 'ADMINISTRATEUR'
}

export enum Sexe {
    MASCULIN = 'MASCULIN',
    FEMININ = 'FEMININ'
}