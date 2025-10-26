import { Utilisateur } from "./utilisateur";

export class Administrateur extends Utilisateur{
    public NiveauAcces?: NiveauAcces;
    
    constructor(){
        super();
    }

}

export enum NiveauAcces {
    BASIQUE,
    AVANCE,
    SUPER
}