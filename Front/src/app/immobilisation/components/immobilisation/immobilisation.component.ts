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
type AOA = any[][];

@Component({
  selector: 'app-immobilisation',
  templateUrl: './immobilisation.component.html',
  styleUrls: ['./immobilisation.component.sass']
})
export class ImmobilisationComponent implements OnInit {

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

  columns = [
    { element: 'numero_ordre', name: 'Numéro d\'ordre', width: 100 },
    { element: 'code', name: 'Code', width: 100 },
    { element: 'compte_dimmobilisation', name: 'Compte d\Immobilisation', width: 100 }//ninea,adresse
  ];


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

  ngOnInit(): void {
    this.getInventaireByEse();
    this.securityServ.showLoadingIndicatior.next(false);
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
  update(row){
    this.details=false
    this.image=""
    this.editRow(row)
  }
  showDetails(row){
    console.log(row);
    this.details=true
    this.editRow(row, true)
  }

  getImmos() {
    this.immoService.getImmobilisationByInventaire(this.idCurrentInv).then((e) => {
      this.allImmos = e;
      //console.log(this.allImmos);

    });
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

  deleteImmoInventaire() {
    if (this.idCurrentInv == undefined) {
      this.showNotification('bg-red', 'Selectionner un Inventaire', 'top', 'center')

    } else {
      for (let index = 0; index < this.allImmos.length; index++) {
        const element = this.allImmos[index];
        this.securityServ.showLoadingIndicatior.next(true);
        this.immoService.deleteImmoByInventaire(element.id).then(e => {});
        this.showNotification('bg-success', 'Supréssion ', 'top', 'center');
        this.getImmos();
        this.securityServ.showLoadingIndicatior.next(false);
      }
    }


  }

  getInventaireByEse() {
      this.securityServ.showLoadingIndicatior.next(true);
      this.idCurrentEse = localStorage.getItem("currentEse")
    this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(rep => {
      this.inventaires = rep;
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

  getAllImmos(evt: any) {

    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }));

      console.log(this.data);


      for (let index = 1; index < this.data.length - 1; index++) {
        const element = this.data[index];
        if (element.length != 15) {
          this.verifIfCorrect = false;
        }

      }

      if (this.verifIfCorrect && this.idCurrentInv != undefined) {
        for (let index = 1; index < this.data.length-1; index++) {
          const element = this.data[index];
          

          const dA = element[6].split('/')[2] + '-' + element[6].split('/')[1] + '-' + element[6].split('/')[0];
          const dM = element[7].split('/')[2] + '-' + element[7].split('/')[1] + '-' + element[7].split('/')[0];
          const dU = (parseInt(element[6].split('/')[2]) + parseInt(element[8])) + '-' + element[6].split('/')[1] + '-' + element[6].split('/')[0];
          

          if (element[6] == undefined) {
            const dA = new Date();
            console.log('element[6]==undefined)');

            console.log(dA);

          }

          if (element[7] == undefined) {
            const dA = new Date().toDateString;
            console.log(dA);

          }

          const obj = {
            "libelle": element[5],
            "numeroOrdre": element[0],
            "code": element[1],
            "compteImmo": element[2],
            "compteAmort": element[3],
            "emplacement": element[4],
            "description": null,
            "dateAcquisition": dA,
            "dateMiseServ": dM,
            "dureeUtilite": dU,
            "taux": parseFloat(element[9]),
            "valOrigine": parseFloat(element[10]),
            "dotation": parseFloat(element[11]),
            "cumulAmortiss": parseFloat(element[12]),
            "vnc": parseFloat(element[13]),
            "etat": element[14],
            "inventaire": "/api/inventaires/" + this.idCurrentInv,
            "entreprise": "/api/entreprises/" + this.idCurrentEse,

          }

          console.log(obj);
          

          this.immoService.postImmobilisation(obj).then((e) => {
            if (e.id != null) {
              if(index==this.data.length-2) {
                this.showNotification('bg-success', 'Enregistré', 'top', 'center')
                this.getImmos();
              }
            } else {
              this.showNotification('bg-red', 'Veuillez entrez un fichier des immobilisation compatible avec notre template', 'top', 'center')
            }
          });

        }
      } else {
        this.showNotification('bg-red', 'Selectionner un Inventaire', 'top', 'center')
      }

    };
    reader.readAsBinaryString(target.files[0]);
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