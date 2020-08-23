import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperviseurGuard } from '../core/guard/superviseur.guard';
import { ImmobilisationComponent } from './components/immobilisation/immobilisation.component';


const routes: Routes = [
  {path: 'immos',canActivate:[SuperviseurGuard],component: ImmobilisationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImmobilisationRoutingModule { }
