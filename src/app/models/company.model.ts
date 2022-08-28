export class Company {
    id: number;
    nom: string;
    numSiret: string;
    adresse: string;

    constructor(params: any) {
        Object.assign(this, params);
    }
}
