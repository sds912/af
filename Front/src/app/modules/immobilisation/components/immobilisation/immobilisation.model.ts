
export interface ImmobilisationModel {

    numero_ordre: number;

    code: String,

    compte_immobilisation: number,

    compte_armortissement: number,

    emplacement: String,

    description: String,

    date_acquisition: String

    date_mise_en_service: String,

    durre_utilite: number,

    taux: number,

    valeur_origine: number,

    dotation_exercie: number,

    ammortissement_cumule: number,

    vnc: number,

    etat_du_bien: String

}