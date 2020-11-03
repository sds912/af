import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    id: 'DASH',
    path: '',
    title: 'Accueil',
    icon: 'fas fa-tachometer-alt',
    class: 'menu-toggle',
    roles: ['ROLE_Admin', 'ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint','ROLE_CE' ,'ROLE_MI'],//ne pas oublier les guards en fonction des roles
    submenu: [
      {
        id: 'DASH1',
        path: '/dashboard/main',
        title: 'Dashboard 1',
        icon: '',
        class: 'ml-menu',
        roles: ['ROLE_Admin', 'ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint'],
        submenu: []
      },
      {
        id: 'DASH2',
        path: '/dashboard/dashboard2',
        title: 'Dashboard 2',
        icon: '',
        class: 'ml-menu',
        roles: ['ROLE_Admin', 'ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint'],
        submenu: []
      },
      {
        id: 'DASH3',
        path: '/dashboard/dashboard3',
        title: 'Dashboard 3',
        icon: '',
        class: 'ml-menu',
        roles: ['ROLE_Admin', 'ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint'],
        submenu: []
      }
    ]
  }, // Admin et other 
  {
    id: 'ESE',
    path: '/admin/entreprise',
    title: 'Entités',
    icon: 'fas fa-building',
    class: '',
    roles: ['ROLE_Admin'],
    submenu: []
  },
  {
    id: 'USE',
    path: '/users',
    title: 'Utilisateurs',
    icon: 'fas fa-users',
    class: '',
    roles: ['ROLE_Admin'],
    submenu: []
  },
  // Admin
  {
    id: 'PRE',
    path: '',
    title: 'Préparation',
    icon: 'fas fa-barcode',
    class: 'menu-toggle',
    roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene'],
    submenu: [
      {
        id: 'INS',
        path: '/instruction',
        title: 'Instructions',
        icon: 'fas fa-file-signature',
        class: '',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene'],
        submenu: []
      },
      {
        id: 'INV',
        path: '/inventaires',
        title: 'Inventaires',
        icon: 'fas fa-barcode',
        class: '',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene'],
        submenu: []
      },
    ]
  },
  {
    id: 'INS',
    path: '/instruction',
    title: 'Instructions',
    icon: 'fas fa-file-signature',
    class: '',
    roles: ['ROLE_SuperViseurAdjoint', 'ROLE_MI', 'ROLE_CE'],
    submenu: []
  },
  {
    id: 'PLA',
    path: '',
    title: 'Planification',
    icon: 'far fa-calendar-alt',
    class: 'menu-toggle',
    roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint', 'ROLE_CE'],
    submenu: [
      {
        id: 'ZONE',
        path: '/zonage',
        title: 'Localités',
        icon: 'fas fa-map-marked-alt',
        class: '',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint'],
        submenu: []
      },
      {
        id: 'planing1',
        path: '/affectation',
        title: 'Affectation',
        icon: '',
        class: 'ml-menu',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint', 'ROLE_CE'],
        submenu: []
      },
      {
        id: 'planing2',
        path: "/planning",
        title: 'Planning',
        icon: 'far fa-calendar-alt',
        class: '',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint', 'ROLE_CE'],
        submenu: []
      },
    ]
  },
  {
    id: 'TRA',
    path: '',
    title: 'Traitement',
    icon: 'fas fa-cubes',
    class: 'menu-toggle',
    roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene',],

    submenu: [
      {
        id: 'IMMO',
        path: '/immos',
        title: 'Importer F.I',
        icon: 'fas fa-cubes',
        class: '',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene',],
        submenu: []
      },
      {
        id: 'FC',
        path: "/feuille/comptage",
        title: 'Feuille de comptage',
        icon: 'fas fa-book-open',
        class: '',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene',],
        submenu: []
      },
      {
        id: 'FCA',
        path: "/feuille/comptage",
        title: 'Importer Catalogue',
        icon: 'fas fa-book-open',
        class: '',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene',],
        submenu: []
      },
      {
        id: 'FC',
        path: "/feuille/comptage",
        title: 'Exporter inventaire',
        icon: 'fas fa-cloud-download-alt',
        class: '',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene',],
        submenu: []
      },
      {
        id: 'FCA',
        path: "/feuille/comptage",
        title: 'Importer comptage',
        icon: 'fas fa-cloud-upload-alt',
        class: '',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene',],
        submenu: []
      },
    ]
  },
  {
    id: 'FC',
    path: "/feuille/comptage",
    title: 'Feuille de comptage',
    icon: 'fas fa-book-open',
    class: '',
    roles: ['ROLE_SuperViseurAdjoint', 'ROLE_CE'],
    submenu: []
  },
  {
    id: 'AJT',
    path: '',
    title: 'Ajustement',
    icon: 'fas fa-check-double',
    class: 'menu-toggle',
    roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint'],
    submenu: [
      {
        id: 'AJU2',
        path: "/code/defectueux",
        title: 'Ajout de codes barres',
        icon: '',
        class: 'ml-menu',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint'],
        submenu: []
      },
      {
        id: 'AJU2',
        path: "/code/defectueux",
        title: 'Autre Adjustement',
        icon: '',
        class: 'ml-menu',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint'],
        submenu: []
      },
      {
        id: 'AJU3',
        path: "/ajuster/fi",
        title: 'F.I. ajusté',//si change modifier le html count approuve
        icon: '',
        class: 'ml-menu',
        roles: ['ROLE_Superviseur', 'ROLE_SuperViseurGene', 'ROLE_SuperViseurAdjoint'],
        submenu: []
      }
    ]
  },
  {
    id: 'planing2',
    path: "/planning",
    title: 'Planning',
    icon: 'far fa-calendar-alt',
    class: '',
    roles: ['ROLE_MI'],
    submenu: []
  },

  // {
  //   id:'CLI',
  //   path: '/clients',
  //   title: 'Clients',
  //   icon: 'fas fa-building',
  //   class: '',
  //   roles:['ROLE_SuperAdmin'],
  //   submenu: []
  // },
  // {
  //   id:'INS',
  //   path: '/instruction',
  //   title: 'Instructions',
  //   icon: 'fas fa-file-signature',
  //   class: '',
  //   roles:['ROLE_SuperViseurAdjoint','ROLE_CE','ROLE_MI'],
  //   submenu: []
  // },
  // {
  //   id:'INV',
  //   path: '/inventaires',
  //   title: 'Inventaires',
  //   icon: 'fas fa-barcode',
  //   class: '',
  //   roles:[,'ROLE_SuperViseurAdjoint'],
  //   submenu: []
  // },
  // {
  //   id:'ZONE',
  //   path: '/zonage',
  //   title: 'Localités',
  //   icon: 'fas fa-map-marked-alt',
  //   class: '',
  //   roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint'],
  //   submenu: []
  // },
  // {
  //   id:'EQUI',
  //   path: '/users',
  //   title: 'Utilisateurs',
  //   icon: 'fas fa-users',
  //   class: '',
  //   roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Admin'],
  //   submenu: []
  // },
  // {
  //   id:'IMMO',
  //   path: '/immos',
  //   title: 'Immobilisations',
  //   icon: 'fas fa-cubes',
  //   class: '',
  //   roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint'],
  //   submenu: []
  // },
  // {
  //   id:'planing2',
  //   path: "/planning",
  //   title: 'Calendrier',
  //   icon: 'far fa-calendar-alt',
  //   class: '',
  //   roles:['ROLE_MI'],
  //   submenu: []
  // },
  // {
  //   id:'planing',
  //   path: '',
  //   title: "Planning",
  //   icon: 'far fa-calendar-alt',
  //   class: 'menu-toggle',
  //   roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_CE'],
  //   submenu: [
  //     {
  //       id:'planing1',
  //       path: '/affectation',
  //       title: 'Affectation',
  //       icon: '',
  //       class: 'ml-menu',
  //       roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_CE'],
  //       submenu: []
  //     },
  //     {
  //       id:'planing2',
  //       path: "/planning",
  //       title: 'Calendrier',
  //       icon: 'far fa-calendar-alt',
  //       class: 'ml-menu',
  //       roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_CE'],
  //       submenu: []
  //     }
  //   ]
  // },
  // {
  //   id:'FC',
  //   path: "/feuille/comptage",
  //   title: 'Feuille de comptage',
  //   icon: 'fas fa-book-open',
  //   class: '',
  //   roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint'],
  //   submenu: []
  // },
  // {
  //   id:'AJU',
  //   path: '',
  //   title: "Ajustement",
  //   icon: 'fas fa-check-double',
  //   class: 'menu-toggle',
  //   roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint'],
  //   submenu: [
  //     {
  //       id:'AJU2',
  //       path: "/code/defectueux",
  //       title: 'Ajout de codes barres',
  //       icon: '',
  //       class: 'ml-menu',
  //       roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint'],
  //       submenu: []
  //     },
  //     {
  //       id:'AJU3',
  //       path: "/ajuster/fi",
  //       title: 'Ajuster F I',//si change modifier le html count approuve
  //       icon: '',
  //       class: 'ml-menu',
  //       roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint'],
  //       submenu: []
  //     }
  //   ]
  // },
  // {
  //   id:'FC',
  //   path: "immobilisations/ajustees",
  //   title: 'F I ajustées',
  //   icon: 'fas fa-align-justify',
  //   class: '',
  //   roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint'],
  //   submenu: []
  // },
];
