export interface Affectation{
    debut: Date;
    fin: Date;
    id: number;
    inventaire: {id: number, status: boolean}
    localite: {id: number, nom: string, level: number}
}