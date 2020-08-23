import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImmobilisationRoutingModule } from './immobilisation-routing.module';
import { ImmobilisationComponent } from './components/immobilisation/immobilisation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { MatChipsModule } from '@angular/material/chips';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatMenuModule } from '@angular/material/menu';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SafeUrlPipe } from '../shared/pipe/safe-url.pipe';
import { MatStepperModule } from '@angular/material/stepper';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

@NgModule({
  declarations: [ImmobilisationComponent],
  imports: [
    CommonModule,
    ImmobilisationRoutingModule,
    CommonModule,
    FormsModule,    
    ReactiveFormsModule,
    PerfectScrollbarModule,
    // MatChipsModule,
    // MatAutocompleteModule,

    
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatListModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSliderModule,
    MatTabsModule,
    MatProgressButtonsModule,
    MatCheckboxModule,

    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatSnackBarModule,

    MatTableModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MaterialFileInputModule,
    MatMenuModule,
    NgxDatatableModule,
    MatStepperModule
  ]
})
export class ImmobilisationModule { }
