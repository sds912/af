import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntrepriseComponent } from './components/entreprise/entreprise.component';
import { AdminGuard } from 'src/app/core/guard/admin.guard';
import { SupervAdminGuard } from 'src/app/core/guard/superv-admin.guard';
import { PersonnelsComponent } from './components/personnels/personnels.component';
const routes: Routes = [
  {path: 'entreprise',canActivate:[SupervAdminGuard],component: EntrepriseComponent},
  {path: 'personnels',canActivate:[AdminGuard],component: PersonnelsComponent}
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
