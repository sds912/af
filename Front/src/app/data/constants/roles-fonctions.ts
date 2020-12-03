export const enum Roles_Fonctions {
    // ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = `Administrateur`, // Administrateur de l'application
    ROLE_GUEST = `Invité`, // Accès visiteur sut l'application
    ROLE_SUPERVISEUR = `Superviseur`, // Accès sur l'application avec les mêmes droit que le superviseur général ainsi que le superviseur adjoint
    ROLE_SUPERVISEUR_GENERAL = `Superviseur général`, // Superviseur général des inventaires
    ROLE_SUPERVISEUR_ADJOINT = `Superviseur adjoint`, // Superviseur adjoint des inventaires
    ROLE_CHEF_EQUIPE = `Chef d'équipe de comptage`, // Chef d'équipe de comptage
    ROLE_MEMBRE_EQUIPE = `Membre d'équipe de comptage`, // Membre d'équipe de comptage
    ROLE_PRESIDENT_COMITE = `Président du comité`, // Président du comité d'inventaire
    ROLE_MEMBRE_COMITE = `Membre du comité` // Membre du comité d'inventaire
}