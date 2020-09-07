import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperviseurGuard } from '../core/guard/superviseur.guard';
import { AffectationComponent } from './components/affectation/affectation.component';
import { PlaningComponent } from './components/planing/planing.component';

const routes: Routes = [
  {path: 'affectation',component: AffectationComponent},
  {path: 'planning',component: PlaningComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaningRoutingModule { }
