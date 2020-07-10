import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    id:'DASH',
    path: '',
    title: 'Home',
    icon: 'fas fa-tachometer-alt',
    class: 'menu-toggle',
    roles:['ROLE_Admin','ROLE_Superviseur','ROLE_Guest'],//ne pas oublier les guards en fonction des roles
    submenu: [
      {
        id:'DASH1',
        path: '/dashboard/main',
        title: 'Dashboard 1',
        icon: '',
        class: 'ml-menu',
        roles:['ROLE_Admin','ROLE_Superviseur','ROLE_Guest'],
        submenu: []
      },
      {
        id:'DASH2',
        path: '/dashboard/dashboard2',
        title: 'Dashboard 2',
        icon: '',
        class: 'ml-menu',
        roles:['ROLE_Admin','ROLE_Superviseur','ROLE_Guest'],
        submenu: []
      },
      {
        id:'DASH3',
        path: '/dashboard/dashboard3',
        title: 'Dashboard 3',
        icon: '',
        class: 'ml-menu',
        roles:['ROLE_Admin','ROLE_Superviseur','ROLE_Guest'],
        submenu: []
      }
    ]
  },
  {
    id:'ESE',
    path: '/admin/entreprise',
    title: 'Entités',
    icon: 'fas fa-building',
    class: '',
    roles:['ROLE_Admin','ROLE_Superviseur','ROLE_Guest'],
    submenu: []
  },
  // {
  //   id:'USER',
  //   path: '/admin/user',
  //   title: 'Utilisateurs',
  //   icon: 'fas fa-users',
  //   class: '',
  //   roles:['ROLE_Admin','ROLE_Guest'],
  //   submenu: []
  // },
  {
    id:'INV',
    path: '',
    title: 'Créer un inventaire',
    icon: 'fas fa-barcode',
    class: 'menu-toggle',
    roles:['ROLE_Superviseur','ROLE_Guest'],
    submenu: [
      {
        id:'INV1',//Ne pas modifier meme s il ne respecte pas l ordre 1,2,3... car les guest se basse sur les id pour avoir accès aux pages 
        path: '/dashboard/main',
        title: 'Instructions',
        icon: '',
        class: 'ml-menu',
        roles:['ROLE_Superviseur','ROLE_Guest'],
        submenu: []
      },
      {
        id:'INV2',
        path: '/dashboard/dashboard2',
        title: 'Désignation du comité',
        icon: '',
        class: 'ml-menu',
        roles:['ROLE_Superviseur','ROLE_Guest'],
        submenu: []
      },
      {
        id:'INV3',
        path: '/zonage',
        title: 'Localités',
        icon: '',
        class: 'ml-menu',
        roles:['ROLE_Superviseur','ROLE_Guest'],
        submenu: []
      }
    ]
  },
  {
    id:'EQUI',
    path: '/users',
    title: 'Utilisateurs',
    icon: 'fas fa-users',
    class: '',
    roles:['ROLE_Superviseur','ROLE_Admin','ROLE_Guest'],
    submenu: []
  },
];
