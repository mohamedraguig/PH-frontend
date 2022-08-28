import {Company} from './company.model';

export class Employee {
    id: number;
    nom: string;
    prenom: string;
    adresse: string;
    email: string;
    dateNaissance: string;
    telephone: string;
    numSecuriteSociale: string;
    nationalite: string;
    dateEmbauche: string;
    poste: string;
    tauxHoraire: number;
    nbrHeures: number;
    mutuelle: boolean;
    tempsPartiel: boolean;
    jrsSemaine: string[];
    commentaire: string;
    dateSortie: string;
    causeSortie: string;
    dernierJrTravaille: string;
    actif: boolean;
    company: Company;

    constructor(params: any) {
        Object.assign(this, params);
    }
}
