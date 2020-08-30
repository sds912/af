import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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

import { FormsModule } from '@angular/forms';

import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};
@NgModule({
  declarations: [AffectationComponent, PlaningComponent],
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
    MatDatepickerModule
  ]
})
export class PlaningModule { }
