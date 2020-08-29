import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    id:'DASH',
    path: '',
    title: 'Home',
    icon: 'fas fa-tachometer-alt',
    class: 'menu-toggle',
    roles:['ROLE_Admin','ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Guest'],//ne pas oublier les guards en fonction des roles
    submenu: [
      {
        id:'DASH1',
        path: '/dashboard/main',
        title: 'Dashboard 1',
        icon: '',
        class: 'ml-menu',
        roles:['ROLE_Admin','ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Guest'],
        submenu: []
      },
      {
        id:'DASH2',
        path: '/dashboard/dashboard2',
        title: 'Dashboard 2',
        icon: '',
        class: 'ml-menu',
        roles:['ROLE_Admin','ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Guest'],
        submenu: []
      },
      {
        id:'DASH3',
        path: '/dashboard/dashboard3',
        title: 'Dashboard 3',
        icon: '',
        class: 'ml-menu',
        roles:['ROLE_Admin','ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Guest'],
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
    roles:['ROLE_Admin','ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Guest'],
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
    path: '/inventaires',
    title: 'Inventaires',
    icon: 'fas fa-barcode',
    class: '',
    roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Guest'],
    submenu: []
  },
  {
    id:'ZONE',
    path: '/zonage',
    title: 'Localités',
    icon: 'fas fa-map-marked-alt',
    class: '',
    roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Guest'],
    submenu: []
  },
  {
    id:'EQUI',
    path: '/users',
    title: 'Utilisateurs',
    icon: 'fas fa-users',
    class: '',
    roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Admin','ROLE_Guest'],
    submenu: []
  },
  {
    id:'planing',
    path: '',
    title: "Planning",
    icon: 'far fa-calendar-alt',
    class: 'menu-toggle',
    roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Guest','ROLE_CE'],
    submenu: [
      {
        id:'planing1',
        path: '/affectation',
        title: 'Affectation',
        icon: '',
        class: 'ml-menu',
        roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Guest','ROLE_CE'],
        submenu: []
      },
      {
        id:'planing2',
        path: "/planning",
        title: 'Calendrier',
        icon: '',
        class: 'ml-menu',
        roles:['ROLE_Superviseur','ROLE_SuperViseurGene','ROLE_SuperViseurAdjoint','ROLE_Guest','ROLE_CE'],
        submenu: []
      }
    ]
  }
];
