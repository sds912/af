"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InventaireModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var inventaire_routing_module_1 = require("./inventaire-routing.module");
var zonage_component_1 = require("./components/zonage/zonage.component");
var forms_1 = require("@angular/forms");
// import { MatChipsModule } from '@angular/material/chips';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
var button_1 = require("@angular/material/button");
var icon_1 = require("@angular/material/icon");
var badge_1 = require("@angular/material/badge");
var chips_1 = require("@angular/material/chips");
var autocomplete_1 = require("@angular/material/autocomplete");
var bottom_sheet_1 = require("@angular/material/bottom-sheet");
var list_1 = require("@angular/material/list");
var sidenav_1 = require("@angular/material/sidenav");
var snack_bar_1 = require("@angular/material/snack-bar");
var expansion_1 = require("@angular/material/expansion");
var datepicker_1 = require("@angular/material/datepicker");
var card_1 = require("@angular/material/card");
var progress_spinner_1 = require("@angular/material/progress-spinner");
var progress_bar_1 = require("@angular/material/progress-bar");
var slider_1 = require("@angular/material/slider");
var tabs_1 = require("@angular/material/tabs");
var checkbox_1 = require("@angular/material/checkbox");
var form_field_1 = require("@angular/material/form-field");
var input_1 = require("@angular/material/input");
var mat_progress_buttons_1 = require("mat-progress-buttons");
var equipe_component_1 = require("./components/equipe/equipe.component");
var table_1 = require("@angular/material/table");
var paginator_1 = require("@angular/material/paginator");
var radio_1 = require("@angular/material/radio");
var select_1 = require("@angular/material/select");
var dialog_1 = require("@angular/material/dialog");
var sort_1 = require("@angular/material/sort");
var toolbar_1 = require("@angular/material/toolbar");
var ngx_material_file_input_1 = require("ngx-material-file-input");
var menu_1 = require("@angular/material/menu");
var ngx_datatable_1 = require("@swimlane/ngx-datatable");
var ngx_perfect_scrollbar_1 = require("ngx-perfect-scrollbar");
var inventaire_component_1 = require("./components/inventaire/inventaire.component");
var safe_url_pipe_1 = require("../shared/pipe/safe-url.pipe");
var stepper_1 = require("@angular/material/stepper");
var instruction_component_1 = require("./components/instruction/instruction.component");
var slide_toggle_1 = require("@angular/material/slide-toggle");
var DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
    suppressScrollX: true,
    wheelPropagation: false
};
var InventaireModule = /** @class */ (function () {
    function InventaireModule() {
    }
    InventaireModule = __decorate([
        core_1.NgModule({
            declarations: [safe_url_pipe_1.SafeUrlPipe, zonage_component_1.ZonageComponent, equipe_component_1.EquipeComponent, inventaire_component_1.InventaireComponent, instruction_component_1.InstructionComponent],
            imports: [
                common_1.CommonModule,
                inventaire_routing_module_1.InventaireRoutingModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ngx_perfect_scrollbar_1.PerfectScrollbarModule,
                slide_toggle_1.MatSlideToggleModule,
                // MatChipsModule,
                // MatAutocompleteModule,
                button_1.MatButtonModule,
                icon_1.MatIconModule,
                form_field_1.MatFormFieldModule,
                input_1.MatInputModule,
                badge_1.MatBadgeModule,
                chips_1.MatChipsModule,
                autocomplete_1.MatAutocompleteModule,
                bottom_sheet_1.MatBottomSheetModule,
                list_1.MatListModule,
                sidenav_1.MatSidenavModule,
                snack_bar_1.MatSnackBarModule,
                expansion_1.MatExpansionModule,
                datepicker_1.MatDatepickerModule,
                card_1.MatCardModule,
                progress_spinner_1.MatProgressSpinnerModule,
                progress_bar_1.MatProgressBarModule,
                slider_1.MatSliderModule,
                tabs_1.MatTabsModule,
                mat_progress_buttons_1.MatProgressButtonsModule,
                checkbox_1.MatCheckboxModule,
                common_1.CommonModule,
                common_1.CommonModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ngx_datatable_1.NgxDatatableModule,
                snack_bar_1.MatSnackBarModule,
                table_1.MatTableModule,
                paginator_1.MatPaginatorModule,
                radio_1.MatRadioModule,
                select_1.MatSelectModule,
                dialog_1.MatDialogModule,
                sort_1.MatSortModule,
                toolbar_1.MatToolbarModule,
                ngx_material_file_input_1.MaterialFileInputModule,
                menu_1.MatMenuModule,
                ngx_datatable_1.NgxDatatableModule,
                stepper_1.MatStepperModule
            ]
        })
    ], InventaireModule);
    return InventaireModule;
}());
exports.InventaireModule = InventaireModule;
