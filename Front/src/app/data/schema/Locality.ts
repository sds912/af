export interface Locality{
    id?: number;
    position?: string[];
    nom?: string;
    level?: string;
    idParent?: number;
    createur?:{
        id: number;
        nom: string;
    }
}