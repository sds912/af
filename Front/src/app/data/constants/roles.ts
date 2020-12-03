export const enum Roles {
    // ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_Admin', // Administrateur de l'application
    ROLE_GUEST = 'ROLE_Guest', // Accès visiteur sut l'application
    ROLE_SUPERVISEUR = 'ROLE_Superviseur', // Accès sur l'application avec les mêmes droit que le superviseur général ainsi que le superviseur adjoint
    ROLE_SUPERVISEUR_GENERAL = 'ROLE_SuperViseurGene', // Superviseur général des inventaires
    ROLE_SUPERVISEUR_ADJOINT = 'ROLE_SuperViseurAdjoint', // Superviseur adjoint des inventaires
    ROLE_CHEF_EQUIPE = 'ROLE_CE', // Chef d'équipe de comptage
    ROLE_MEMBRE_EQUIPE = 'ROLE_MI', // Membre d'équipe de comptage
    ROLE_PRESIDENT_COMITE = 'ROLE_PC', // Président du comité d'inventaire
    ROLE_MEMBRE_COMITE = 'ROLE_MC' // Membre du comité d'inventaire
}