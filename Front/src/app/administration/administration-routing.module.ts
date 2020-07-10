import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntrepriseComponent } from './components/entreprise/entreprise.component';
import { UserComponent } from './components/user/user.component';
import { AdminGuard } from 'src/app/core/guard/admin.guard';
import { SupervAdminGuard } from 'src/app/core/guard/superv-admin.guard';
const routes: Routes = [
  {path: 'entreprise',canActivate:[SupervAdminGuard],component: EntrepriseComponent},
  //{path: 'user',canActivate:[AdminGuard],component: UserComponent}
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
