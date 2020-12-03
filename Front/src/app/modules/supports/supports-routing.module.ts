import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfosSupportComponent } from './pages/infos-support/infos-support.component';
import { ListSupportsComponent } from './pages/list-supports/list-supports.component';
import { NewSupportComponent } from './pages/new-support/new-support.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/supports/lists',
    pathMatch: 'full'
  },
  {
    path: 'lists',
    component: ListSupportsComponent
  },
  {
    path: 'new',
    component: NewSupportComponent
  },
  {
    path: 'infos/:id',
    component: InfosSupportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportsRoutingModule { }
