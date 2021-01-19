import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OverlayPanelModule} from 'primeng/overlaypanel';


import { PlaningRoutingModule } from './planing-routing.module';
import { AffectationComponent } from './components/affectation/affectation.component';
import { PlaningComponent } from './components/planing/planing.component';



import { MatButtonModule } from '@angular/material/button';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import {CheckboxModule} from 'primeng/checkbox';
import {OrderListModule} from 'primeng/orderlist';
import {AccordionModule} from 'primeng/accordion';
import {TreeModule} from 'primeng/tree';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';









import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { AffectationNewModelComponent } from './components/affectation-new-model/affectation-new-model.component';
import { UserListComponent } from './elements/user-list/user-list.component';
import { LocalityPlanningComponent } from './elements/locality-planning/locality-planning.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};
@NgModule({
  declarations: [AffectationComponent, PlaningComponent, AffectationNewModelComponent, UserListComponent, LocalityPlanningComponent],
  imports: [
    CommonModule,
    PlaningRoutingModule,
    PerfectScrollbarModule,
    MatButtonModule,
    NgxDatatableModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    MatChipsModule,
    MatDatepickerModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    TableModule,
    CheckboxModule,
    OrderListModule,
    AccordionModule,
    TreeModule,
    CalendarModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    ToastModule,
    DialogModule,
    OverlayPanelModule,
    TooltipModule,
    MessageModule,
    MessagesModule
  
    
    
  ],
  
})
export class PlaningModule { }
