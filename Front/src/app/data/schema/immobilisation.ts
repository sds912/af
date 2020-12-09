export interface Immobilisation {
    id?: number;
    code?: string;
    numeroOrdre?: string;
    libelle?: string;
    compteImmo?: string;
    compteAmort?: string;
    emplacement?: string;
    dateAcquisition?: Date;
    dateMiseServ?: Date;
    dateSortie?: Date;
    dureeUtilite?:string;
    taux?: number;
    valOrigine?: number;
    dotation?: number;
    cumulAmortiss?: number;
    vnc?: number;
    etat?: string;
    description?: string;
    entreprise?: any;
}