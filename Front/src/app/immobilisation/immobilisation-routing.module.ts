import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperviseurGuard } from '../core/guard/superviseur.guard';
import { AjusterFiComponent } from './components/ajuster-fi/ajuster-fi.component';
import { CodeDefectueuxComponent } from './components/code-defectueux/code-defectueux.component';
import { FeuilleComptageComponent } from './components/feuille-comptage/feuille-comptage.component';
import { ImmobilisationComponent } from './components/immobilisation/immobilisation.component';
import { TraitementComponent } from './components/traitement/traitement.component';


const routes: Routes = [
  {path: 'immos',canActivate:[SuperviseurGuard],component: ImmobilisationComponent},
  {path: 'traitement',canActivate:[SuperviseurGuard],component: TraitementComponent},
  {path: 'traitement/reload',canActivate:[SuperviseurGuard],component: TraitementComponent},
  {path: 'feuille/comptage',canActivate:[SuperviseurGuard],component: FeuilleComptageComponent},
  {path: 'code/defectueux',canActivate:[SuperviseurGuard],component: CodeDefectueuxComponent},
  {path: 'ajuster/fi',canActivate:[SuperviseurGuard],component: AjusterFiComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImmobilisationRoutingModule { }
