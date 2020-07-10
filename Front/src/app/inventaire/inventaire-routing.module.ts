import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'src/app/core/guard/admin.guard';
import { SupervAdminGuard } from 'src/app/core/guard/superv-admin.guard';
import { SuperviseurGuard } from 'src/app/core/guard/superviseur.guard';
import { ZonageComponent } from './components/zonage/zonage.component';
import { EquipeComponent } from './components/equipe/equipe.component';
const routes: Routes = [
  {path: 'zonage',canActivate:[SuperviseurGuard],component: ZonageComponent},
  {path: 'users',canActivate:[SupervAdminGuard],component: EquipeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventaireRoutingModule { }
