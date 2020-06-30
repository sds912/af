import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
const routes: Routes = [
  {
    path: 'dashboard',canActivate:[AuthGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'email',canActivate:[AuthGuard],
    loadChildren: () => import('./email/email.module').then(m => m.EmailModule)
  },
  {
    path: 'apps',canActivate:[AuthGuard],
    loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
  },
  {
    path: 'widget',canActivate:[AuthGuard],
    loadChildren: () =>
      import('./widget/widget.module').then(m => m.WidgetModule)
  },
  {
    path: 'ui',canActivate:[AuthGuard],
    loadChildren: () => import('./ui/ui.module').then(m => m.UiModule)
  },
  {
    path: 'forms',canActivate:[AuthGuard],
    loadChildren: () => import('./forms/forms.module').then(m => m.FormModule)
  },
  {
    path: 'tables',canActivate:[AuthGuard],
    loadChildren: () =>
      import('./tables/tables.module').then(m => m.TablesModule)
  },
  {
    path: 'media',canActivate:[AuthGuard],
    loadChildren: () => import('./media/media.module').then(m => m.MediaModule)
  },
  {
    path: 'charts',canActivate:[AuthGuard],
    loadChildren: () =>
      import('./charts/charts.module').then(m => m.ChartsModule)
  },
  {
    path: 'timeline',canActivate:[AuthGuard],
    loadChildren: () =>
      import('./timeline/timeline.module').then(m => m.TimelineModule)
  },
  {
    path: 'icons',canActivate:[AuthGuard],
    loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule)
  },
  {
    path: '',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        m => m.AuthenticationModule
      )
  },
  {
    path: 'extra-pages',canActivate:[AuthGuard],
    loadChildren: () =>
      import('./extra-pages/extra-pages.module').then(m => m.ExtraPagesModule)
  },
  {
    path: 'maps',canActivate:[AuthGuard],
    loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
  },


  {
    path: 'admin',canActivate:[AuthGuard],
    loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
  },
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
