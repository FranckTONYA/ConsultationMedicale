import { Utilisateur } from "./utilisateur";

export class Medecin extends Utilisateur{
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