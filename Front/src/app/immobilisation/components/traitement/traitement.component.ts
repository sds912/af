import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ImmobilisationService } from '../../services/immobilisation.service';
import { AdminService } from 'src/app/administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import * as XLSX from 'xlsx';
import { InventaireService } from 'src/app/inventaire/service/inventaire.service';
import { async } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IMAGE64 } from 'src/app/administration/components/entreprise/image';
import { DatatableComponent } from '@swimlane/ngx-datatable';
type AOA = any[][];
@Component({
  selector: 'app-traitement',
  templateUrl: './traitement.component.html',
  styleUrls: ['./traitement.component.sass']
})
export class TraitementComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  @ViewChild('showImmo', { static: false }) showImmo: TemplateRef<any>;
  @ViewChild('formDirective') private formDirective: NgForm;


  data = [];

  allImmos = [];

  verifIfCorrect: boolean = true;

  idCurrentInv;

  isAllcorrect: boolean = false;

  editForm: FormGroup;

  selectedRowData: selectRowInterface;

  show=false
  imgLink=""
  image:string=IMAGE64;
  fileToUploadPp:File=null;
  defaultImag=IMAGE64
  details=false
  idCurrentEse;
  inventaires = [];
  statusImmo="-1"
  typeImmo=""
  filteredData = [];
  columns = [
    { element: 'numero_ordre', name: 'Numéro d\'ordre', width: 100 },
    { element: 'code', name: 'Code', width: 100 },
    { element: 'compte_dimmobilisation', name: 'Compte d\Immobilisation', width: 100 }//ninea,adresse
  ];
  colNmbre = 5
  constructor(private immoService: ImmobilisationService,
    private adminServ: AdminService,
    private sharedService: SharedService,
    private securityServ: SecurityService,
    private inventaireServ: InventaireService,
    private fb: FormBuilder, 
    private _snackBar: MatSnackBar,
  ) { 
    this.editForm = this.fb.group({
      id: [0],
      image: [''],
      denomination: ['', [Validators.required]],
      republique: [''],
      sigleUsuel: [''],
      capital: [''],
      ville: [''],
      ninea: [''],
      adresse: ['']
    });
  }

  ngOnInit(): void {//faire le get status pour les details
    this.getInventaireByEse();
  }

  editRow(row,lock=false) {
    if(this.formDirective)this.formDirective.resetForm()
    this.editForm = this.fb.group({
      id: [{value: row.id, disabled: lock}],
      image: [{value: row.image, disabled: lock}],
      denomination: [{value: row.denomination, disabled: lock}, [Validators.required]],
      republique: [{value: row.republique, disabled: lock}],
      sigleUsuel: [{value: row.sigleUsuel, disabled: lock}],
      capital: [{value: row.capital, disabled: lock}],
      ville: [{value: row.ville, disabled: lock}],
      ninea: [{value: row.ninea, disabled: lock}],
      adresse: [{value: row.adresse, disabled: lock}]
    });
    this.selectedRowData = row;
  }

  showDetails(row){
    this.details=true
    this.editRow(row, true)
  }

  getImmos() {
    this.securityServ.showLoadingIndicatior.next(true);
    this.immoService.getImmobilisationByInventaire(this.idCurrentInv).then((e) => {
      this.allImmos = e;
      this.setData(e)
      this.securityServ.showLoadingIndicatior.next(false);
    }, error => {
      this.securityServ.showLoadingIndicatior.next(false);
      console.log(error)
    });
  }

  setData(data){
    this.data=data?.filter(immo=>this.statusImmo!='-1' && immo.status==this.statusImmo ||this.statusImmo=='-1' && immo.status==null)
    this.filteredData = data;
    console.log(this.data)
  }

  showNotification(colorName, text, placementFrom, placementAlign, duree = 2000) {
    this._snackBar.open(text, '', {
      duration: duree,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: [colorName, 'color-white']
    });
  }

  longText(text, limit) {
    return this.sharedService.longText(text, limit)
  }

  getInventaireByEse() {
      this.securityServ.showLoadingIndicatior.next(true);
      this.idCurrentEse = localStorage.getItem("currentEse")
      this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(rep => {
        this.inventaires = rep?.reverse();
        this.idCurrentInv = this.inventaires[0].id;
        this.getImmos();
        this.securityServ.showLoadingIndicatior.next(false);
      }, error => {
        this.securityServ.showLoadingIndicatior.next(false);
        console.log(error)
      })
  }

  inventaireChange(event: any) {
    this.getImmos();
  }

  showDialogImmo() {
    this.showImmo.elementRef.nativeElement.click();
  }

  filtreImmoChange(){
    this.data=this.filteredData?.filter(immo=>(this.statusImmo!='-1' && immo.status==this.statusImmo ||this.statusImmo=='-1' && immo.status==null) && (immo.endEtat==this.typeImmo || this.typeImmo==""))
    
    console.log(this.data);
  }
  filterDatatable(value) {
    // get the value of the key pressed and make it lowercase
    const val = value.toLowerCase();
    // get the amount of columns in the table
    const colsAmt = this.colNmbre//this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);
    // assign filtered matches to the active datatable
    this.data = this.filteredData.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        // check for a match
        if (
          item[keys[i]]
            .toString()
            .toLowerCase()
            .indexOf(val) !== -1 ||
          !val
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  getHashId(id){
    return this.sharedService.hashId(id)
  }
  getEtat(endEtat){
    console.log(endEtat);
    
    return endEtat==0?"En mauvais état":"En bon état";
  }
}
export interface selectRowInterface {
  code: String;
  libelle: String;
  description: String;
  compteAmort:String,
  compteImmo : String ,
  cumulAmortiss : number,
  dateAcquisition :String,
  dureeUtilite:String,
  dateMiseServ : String,
  dotation : number,
  emplacement : String ,
  etat :String ,
  numeroOrdre :String ,
  taux : number,
  valOrigine :number,
  vnc :number
}