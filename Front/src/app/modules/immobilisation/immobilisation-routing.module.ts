import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperviseurGuard } from 'src/app/core/guard/superviseur.guard';
import { SuperviseurAndCE } from 'src/app/core/guard/superviseurAndCE.guard ';
import { AjusterFiComponent } from './components/ajuster-fi/ajuster-fi.component';
import { CatalogueComponent } from './components/catalogue/catalogue.component';
import { CodeDefectueuxComponent } from './components/code-defectueux/code-defectueux.component';
import { FeuilleComptageComponent } from './components/feuille-comptage/feuille-comptage.component';
import { ImmobilisationComponent } from './components/immobilisation/immobilisation.component';

const routes: Routes = [
  {path: 'immos',canActivate:[SuperviseurGuard],component: ImmobilisationComponent},
  {path: 'feuille/comptage',canActivate:[SuperviseurAndCE],component: FeuilleComptageComponent},
  {path: 'feuille/comptage/reload',canActivate:[SuperviseurGuard],component: FeuilleComptageComponent},
  {path: 'immobilisations/:type',canActivate:[SuperviseurGuard],component: FeuilleComptageComponent},
  {path: 'code/defectueux',canActivate:[SuperviseurGuard],component: CodeDefectueuxComponent},
  {path: 'ajuster/fi',canActivate:[SuperviseurGuard],component: AjusterFiComponent},
  {path: 'ajuster/fi/:id',canActivate:[SuperviseurGuard],component: AjusterFiComponent},
  {path: 'catalogue',canActivate:[SuperviseurGuard],component: CatalogueComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImmobilisationRoutingModule { }
