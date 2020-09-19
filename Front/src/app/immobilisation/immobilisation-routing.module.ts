import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperviseurGuard } from '../core/guard/superviseur.guard';
import { ImmobilisationComponent } from './components/immobilisation/immobilisation.component';
import { TraitementComponent } from './components/traitement/traitement.component';


const routes: Routes = [
  {path: 'immos',canActivate:[SuperviseurGuard],component: ImmobilisationComponent},
  {path: 'traitement',canActivate:[SuperviseurGuard],component: TraitementComponent},
  {path: 'traitement/reload',canActivate:[SuperviseurGuard],component: TraitementComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImmobilisationRoutingModule { }
