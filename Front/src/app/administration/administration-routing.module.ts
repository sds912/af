import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntrepriseComponent } from './components/entreprise/entreprise.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  {path: 'entreprise',component: EntrepriseComponent},
  {path: 'user',component: UserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
