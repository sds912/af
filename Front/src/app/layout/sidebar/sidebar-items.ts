import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Home',
    icon: 'fas fa-tachometer-alt',
    class: 'menu-toggle',
    roles:['all'],//ne pas oublier les guards en fonction des roles
    submenu: [
      {
        path: '/dashboard/main',
        title: 'Dashboard 1',
        icon: '',
        class: 'ml-menu',
        submenu: []
      },
      {
        path: '/dashboard/dashboard2',
        title: 'Dashboard 2',
        icon: '',
        class: 'ml-menu',
        submenu: []
      },
      {
        path: '/dashboard/dashboard3',
        title: 'Dashboard 3',
        icon: '',
        class: 'ml-menu',
        submenu: []
      }
    ]
  },
  {
    path: '/admin/entreprise',
    title: 'Entités',
    icon: 'fas fa-building',
    class: '',
    roles:['ROLE_Admin','ROLE_Superviseur'],
    submenu: []
  },
  {
    path: '/admin/user',
    title: 'Utilisateurs',
    icon: 'fas fa-users',
    class: '',
    roles:['ROLE_Admin'],
    submenu: []
  },
  {
    path: '',
    title: 'Créer un inventaire',
    icon: 'fas fa-barcode',
    class: 'menu-toggle',
    roles:['ROLE_Superviseur'],
    submenu: [
      {
        path: '/dashboard/main',
        title: 'Instructions',
        icon: '',
        class: 'ml-menu',
        roles:['all'],
        submenu: []
      },
      {
        path: '/dashboard/dashboard2',
        title: 'Désignation du comité',
        icon: '',
        class: 'ml-menu',
        submenu: []
      },
      {
        path: '/zonage',
        title: 'Localités',
        icon: '',
        class: 'ml-menu',
        submenu: []
      }
    ]
  }
];
