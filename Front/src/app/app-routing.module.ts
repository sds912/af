import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { AdminGuard } from './core/guard/admin.guard';
import { SuperAdminGuard } from './core/guard/super-admin.guard';
const routes: Routes = [
  {
    path: 'dashboard',canActivate:[AuthGuard],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'supports',canActivate:[AuthGuard],
    loadChildren: () => import('./modules/supports/supports.module').then(m => m.SupportsModule)
  },
  {
    path: '',
    loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'admin',canActivate:[AuthGuard],
    loadChildren: () => import('./modules/administration/administration.module').then(m => m.AdministrationModule)
  },
  {
    path: '',canActivate:[AuthGuard],
    loadChildren: () => import('./modules/inventaire/inventaire.module').then(m => m.InventaireModule)
  },
  {
    path: '',canActivate:[AuthGuard],
    loadChildren: () => import('./modules/immobilisation/immobilisation.module').then(m => m.ImmobilisationModule)
  },
  {
    path: '',canActivate:[AuthGuard],
    loadChildren: () => import('./modules/planing/planing.module').then(m => m.PlaningModule)
  },
  // {
  //   path: '',canActivate:[AuthGuard,SuperAdminGuard],
  //   loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
  // },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
