import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ImmobilisationService } from 'src/app/data/services/immobilisation/immobilisation.service';
import { AdminService } from 'src/app/modules/administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { InventaireService } from 'src/app/data/services/inventaire/inventaire.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IMAGE64 } from 'src/app/modules/administration/components/entreprise/image';
import Swal from 'sweetalert2';
import { EntrepriseService } from 'src/app/data/services/entreprise/entreprise.service';

@Component({
  selector: 'app-immobilisation',
  templateUrl: './immobilisation.component.html',
  styleUrls: ['./immobilisation.component.sass']
})
export class ImmobilisationComponent implements OnInit {
  @ViewChild('showImmo', { static: false }) showImmo: TemplateRef<any>;
  @ViewChild('formDirective') private formDirective: NgForm;
  data = [];
  allImmos = [];
  verifIfCorrect: boolean = true;
  idCurrentInv;
  editForm: FormGroup;
  selectedRowData: selectRowInterface;
  show = false
  imgLink = ""
  image: string = IMAGE64;
  fileToUploadPp: File = null;
  defaultImag = IMAGE64
  details = false
  idCurrentEse;
  inventaires = [];
  loadingIndicator: boolean = false;
  page: number;
  totalItems: number;
  loadingPercent: number;
  extractTime: number;

  columns = [
    { element: 'numero_ordre', name: 'Numéro d\'ordre', width: 100 },
    { element: 'code', name: 'Code', width: 100 },
    { element: 'compte_dimmobilisation', name: 'Compte d\Immobilisation', width: 100 }//ninea,adresse
  ];


  constructor(private immoService: ImmobilisationService,
    private sharedService: SharedService,
    private securityServ: SecurityService,
    private inventaireServ: InventaireService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private entrepriseService: EntrepriseService
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
    // this.getInventaireByEse();
    this.totalItems = 0;
    this.loadingPercent = -1;
    this.extractTime = 0;
    this.idCurrentEse = localStorage.getItem("currentEse");
    this.idCurrentInv = localStorage.getItem("currentInv");
    this.getImmobilisations(1);
    this.securityServ.showLoadingIndicatior.next(false);
  }

  getImmobilisations(_page: number) {
    this.page = _page;
    if (this.loadingPercent == -1) {
      this.loadingIndicator = true;
    }

    if (this.idCurrentInv == 'undefined' || this.idCurrentInv == null || this.idCurrentInv == '') {
      this.loadingIndicator = false;
      return;
    }

    this.immoService.getAllImmosByEntreprise(this.idCurrentEse, this.idCurrentInv, this.page).then((res: any) => {
      if (res && res['hydra:member']) {
        this.totalItems = res['hydra:totalItems'];
        this.allImmos = res['hydra:member'].filter(immo => immo.status == null || immo.status == 1); 
      }
      this.loadingIndicator = false;
    }, (error: any) => {
      this.loadingIndicator = false;
    })
  }

  handlePageChange(pager: any) {
    this.page = pager.page;
    this.getImmobilisations(this.page);
  }

  editRow(row, lock = false) {
    if (this.formDirective) this.formDirective.resetForm()
    this.editForm = this.fb.group({
      id: [{ value: row.id, disabled: lock }],
      image: [{ value: row.image, disabled: lock }],
      denomination: [{ value: row.denomination, disabled: lock }, [Validators.required]],
      republique: [{ value: row.republique, disabled: lock }],
      sigleUsuel: [{ value: row.sigleUsuel, disabled: lock }],
      capital: [{ value: row.capital, disabled: lock }],
      ville: [{ value: row.ville, disabled: lock }],
      ninea: [{ value: row.ninea, disabled: lock }],
      adresse: [{ value: row.adresse, disabled: lock }]
    });
    this.selectedRowData = row;
  }
  update(row) {
    this.details = false
    this.image = ""
    this.editRow(row)
  }
  showDetails(row) {
    console.log(row);
    this.details = true
    this.editRow(row, true)
  }

  getImmos() {
    this.immoService.getImmobilisationByInventaire(this.idCurrentInv).then((e) => {
      this.allImmos = e.filter(immo => immo.status == null || immo.status == 1);//Seydina je l'ai corrigé
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

  deleteAllImmos() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',

      },
      buttonsStyling: true
    })

    swalWithBootstrapButtons.fire({
      title: 'Ê' + 'TES-VOUS SURE ?'.toLowerCase(),
      text: "de vouloir supprimer le fichier des immobilisations.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, je le veux!',
      cancelButtonText: 'Non, annuler!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.securityServ.showLoadingIndicatior.next(true);
        this.immoService.deleteImmoByEntreprise(this.idCurrentEse).then(e => {
          this.showNotification('bg-success', 'Supréssion ', 'top', 'center');
          this.page = 1;
          this.getImmobilisations(this.page);
          this.securityServ.showLoadingIndicatior.next(false);
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

      }
    })
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

  showDialogImmo() {
    this.showImmo.elementRef.nativeElement.click();
  }

  curency(str : string) {
    return this.sharedService.numStr(str," ");
  }

  getAllImmos(evt: any) {
    if (this.idCurrentInv == 'undefined' || this.idCurrentInv == null || this.idCurrentInv == '') {
      return;
    }

    let fileList: FileList = evt.target.files;
    let fileUpload: File = fileList[0];
    const formData = new FormData();
    formData.append('file', fileUpload, fileUpload.name);
    formData.append('table', 'immobilisations');
    formData.append('entreprise', localStorage.getItem("currentEse"));
    formData.append('inventaire', localStorage.getItem("currentInv"));
    this.loadingPercent = 0;
    this.entrepriseService.importImmobilisations(formData).subscribe((res: any) => {
      this.showNotification('bg-info', res, 'top', 'center')
      evt.target.value = '';
      setTimeout(() => {
        this.getImportProgression();
      }, 5000);
    })
  }

  getImportProgression() {
    this.entrepriseService.importProgession(localStorage.getItem("currentEse"), 'immobilisations').subscribe((res: any) => {
      if (res <= 10) {
        this.extractTime ++;
        if (this.extractTime % 2 == 0 && this.extractTime <=20) {
          this.loadingPercent++;
        }
        setTimeout(() => {
          if (res > 0) {
            this.getImmobilisations(1);
          }
          this.getImportProgression();
        }, 5000);
      } else if(res > 10 && res < 100) {
        this.loadingPercent = res;
        setTimeout(() => {
          this.getImmobilisations(1);
          this.getImportProgression();
        }, 1000);
      } else {
        this.loadingPercent = -1;
        this.getImmobilisations(1);
      }
      console.log(this.extractTime, this.loadingPercent);
    })
  }

  formatSubtitle (percent: number):string {
    if(percent >= 100){
      return "Chargement términé!"
    }else if(percent > 0){
      return "Chargement des données"
    }else {
      return "Extraction des données"
    }
  }
}

//@TOOD::Voir l'utilité de cette interface et essayer de le déplacer si c'est utilisé sinon le supprimé
export interface selectRowInterface {
  code: String;
  libelle: String;
  description: String;
  compteAmort: String,
  compteImmo: String,
  cumulAmortiss: number,
  dateAcquisition: String,
  dureeUtilite: String,
  dateMiseServ: String,
  dotation: number,
  emplacement: String,
  etat: String,
  numeroOrdre: String,
  taux: number,
  valOrigine: number,
  vnc: number
}