import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperviseurGuard } from 'src/app/core/guard/superviseur.guard';
import { AffectationNewModelComponent } from './components/affectation-new-model/affectation-new-model.component';
import { AffectationComponent } from './components/affectation/affectation.component';
import { PlaningComponent } from './components/planing/planing.component';

const routes: Routes = [
  {path: 'affectation',component: AffectationComponent},
  {path: 'planning',component: PlaningComponent},
  {path: 'affectation/new', component: AffectationNewModelComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaningRoutingModule { }
