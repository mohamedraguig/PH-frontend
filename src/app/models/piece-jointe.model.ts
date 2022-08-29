export class PieceJointe {
    id: number;
    name: string;
    length: string;
    content: string;
    type: string;

    constructor(params: any) {
        Object.assign(this, params);
    }
}
