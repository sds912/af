import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'src/app/core/guard/admin.guard';
import { SupervAdminGuard } from 'src/app/core/guard/superv-admin.guard';
import { SuperviseurGuard } from 'src/app/core/guard/superviseur.guard';
import { ZonageComponent } from './components/zonage/zonage.component';
import { EquipeComponent } from './components/equipe/equipe.component';
import { InventaireComponent } from './components/inventaire/inventaire.component';
import { InstructionComponent } from './components/instruction/instruction.component';
const routes: Routes = [
  {path: 'zonage',canActivate:[SuperviseurGuard],component: ZonageComponent},
  {path: 'zonage/:id',canActivate:[SuperviseurGuard],component: ZonageComponent},
  {path: 'users',canActivate:[SupervAdminGuard],component: EquipeComponent},
  {path: 'inventaires',canActivate:[SupervAdminGuard],component: InventaireComponent},
  {path: 'instruction',component: InstructionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventaireRoutingModule { }
