// Sidebar route metadata
export interface RouteInfo {
  id: string;
  path: string;
  title: string;
  icon: string;
  class: string;
  roles:string[];
  submenu: RouteInfo[];
}
