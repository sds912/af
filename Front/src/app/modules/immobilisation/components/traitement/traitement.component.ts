import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { ImmobilisationService } from 'src/app/data/services/immobilisation/immobilisation.service';
import { AdminService } from 'src/app/modules/administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { InventaireService } from 'src/app/data/services/inventaire/inventaire.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IMAGE64 } from 'src/app/modules/administration/components/entreprise/image';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PlaningService } from 'src/app/modules/planing/services/planing.service';
import { timer, combineLatest } from 'rxjs';

@Component({
  selector: 'app-traitement',
  templateUrl: './traitement.component.html',
  styleUrls: ['./traitement.component.sass']
})
export class TraitementComponent implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
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
  statusImmo=-1
  typeImmo=""
  filteredData = [];
  columns = [
    { element: 'numero_ordre', name: 'Numéro d\'ordre', width: 100 },
    { element: 'code', name: 'Code', width: 100 },
    { element: 'compte_dimmobilisation', name: 'Compte d\Immobilisation', width: 100 }//ninea,adresse
  ];
  colNmbre = 5
  notEnd=false
  showPhoto=false
  defaultImg="assets/images/image-gallery/1.jpg"
  myId=""
  localites = [];
  affectations = [];
  timerSubscription: any;
  firstLoad: boolean;
  page: number;
  totalItems: number;

  constructor(private immoService: ImmobilisationService,
    private sharedService: SharedService,
    private securityServ: SecurityService,
    private inventaireServ: InventaireService,
    private fb: FormBuilder, 
    private _snackBar: MatSnackBar,
    public router: Router,
    public route:ActivatedRoute,
    private planingServ: PlaningService
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
    this.firstLoad = true;
    this.myId = localStorage.getItem("idUser")
    this.idCurrentEse = localStorage.getItem("currentEse")
    this.idCurrentInv = localStorage.getItem("currentInv");
    this.getAllLoc()
    this.totalItems = 0;
    this.getImmobilisations(1, `&status=${this.statusImmo}`);
    // this.getInventaireByEse();
    this.sameComponent()
  }

  getImmobilisations(_page: number, filters?: any) {
    this.page = _page;
    this.securityServ.showLoadingIndicatior.next(true);

    if (this.idCurrentInv == 'undefined' || this.idCurrentInv == null || this.idCurrentInv == '') {
      this.securityServ.showLoadingIndicatior.next(false);
      return;
    }

    this.immoService.getAllImmosByEntreprise(this.idCurrentEse, this.idCurrentInv, this.page, 10, filters).then((res: any) => {
      if (res && res['hydra:member']) {
        this.totalItems = res['hydra:totalItems'];
        this.allImmos = res['hydra:member'];
        if (this.data.length != this.allImmos.length) {
          this.setData(this.allImmos);
        }
        this.securityServ.showLoadingIndicatior.next(false);
      }
      this.securityServ.showLoadingIndicatior.next(false);
    }, (error: any) => {
      this.securityServ.showLoadingIndicatior.next(false);
    })
  }

  handlePageChange(pager: any) {
    this.page = pager.page;
    this.getImmobilisations(this.page);
  }

  handleStatusChange(status: any) {
    this.page = 1;
    console.log(status);
    this.statusImmo = status;
    let filters = `&status=${this.statusImmo}`;
    if (this.statusImmo == -1) {
      filters = `&status[]=${this.statusImmo}&status[]=null`;
      console.log(filters);
    }
    this.getImmobilisations(this.page, filters);
  }

  public ngOnDestroy(): void {
    if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
    }
  }
  private subscribeToData(): void {
    this.timerSubscription = combineLatest(timer(5000)).subscribe(() => this.refreshData());
  }
  private refreshData(): void {
    this.getImmos();
    // this.subscribeToData();
  }
  sameComponent(){
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd && event.url=='/traitement/reload') {//apres changement de la route
        this.router.navigateByUrl('/traitement')//si import fichier, le ngOnInit se charge du reste
      }
    });
  }
  getStatus(status):string{
    let text=""
    if(status==0){
      text="Immobilisations avec code barre non réconciliées"
    }else if(status==1){
      text="Immobilisations scannées réconciliées"
    }else if(status==2){
      text="Immobilisations rajoutées"
    }else if(status==3){
      text="Immobilisations avec un code barre défectueux"
    }
    return text
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
    this.showPhoto=false
    this.editRow(row, true)
  }

  getImmos() {
    if (this.firstLoad) {
      this.securityServ.showLoadingIndicatior.next(true);
      this.firstLoad = false;
    }
    this.immoService.getImmobilisationByInventaire(this.idCurrentInv).then((e) => {
      this.allImmos = e;
      if (this.data.length != this.allImmos.length) {
        this.setData(this.allImmos);
      }
      this.securityServ.showLoadingIndicatior.next(false);
    }, error => {
      this.securityServ.showLoadingIndicatior.next(false);
      console.log(error)
    });
  }

  setData(data){
    this.data=data?.filter(immo=>this.statusImmo!=-1 && immo.status==this.statusImmo ||this.statusImmo==-1 && immo.status==null)
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
        this.idCurrentInv = this.inventaires[0]?.id;
        this.refreshData();
        //this.getAffectationByInv(this.idCurrentInv);
        this.securityServ.showLoadingIndicatior.next(false);
      }, error => {
        this.securityServ.showLoadingIndicatior.next(false);
        console.log(error)
      })
  }
  getAffectationByInv(id:number){
    this.planingServ.getAffectations("?inventaire.id="+id).then(
      rep=>{
        console.log(rep);
        this.affectations=rep
      },
      error=>console.log(error)
    )
  }
  
  getAllLoc(){
    this.localites = [];
    // this.inventaireServ.getLocalitesOfEse(this.idCurrentEse).then(localites=>this.localites=localites)
  }

  showDialogImmo() {
    this.showImmo.elementRef.nativeElement.click();
  }

  filtreImmoChange(){
    this.data=this.filteredData?.filter(immo=>
      (this.statusImmo!=-1 && this.statusImmo!=4 && immo.status==this.statusImmo ||
      this.statusImmo==-1 && immo.status==null || this.statusImmo==4 && immo.localite && immo.emplacement?.toLowerCase()!=immo.localite.nom?.toLowerCase()) 
      && (immo.endEtat==this.typeImmo || this.typeImmo==""))
    
    console.log(this.data);
  }
  filterDatatable(value) {
    // get the value of the key pressed and make it lowercase
    const val = value.toLowerCase();
    this.data = this.filteredData.filter(immo=>
      (immo.libelle?.toLowerCase().search(val)>=0 ||
      immo.lecteur?.nom.toLowerCase().search(val)>=0 ||
      immo.localite?.nom.toLowerCase().search(val)>=0 ||
      immo.code?.toLowerCase().search(val)>=0) &&
      (this.statusImmo!=-1 && immo.status==this.statusImmo || this.statusImmo==-1 && immo.status==null) && (immo.endEtat==this.typeImmo || this.typeImmo=="")
    );
    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  getHashId(id){
    return this.sharedService.hashId(id)
  }
  getEtat(endEtat){
    return endEtat==0?"Mauvais état":"Bon état";
  }
  locName(id){
    const localite=this.getOneById(id)
    let idParent=localite?.idParent
    let nom=" - "+localite?.nom
    if(idParent){
      this.localites.forEach(loc=>{
        if(idParent){
          let parent=this.getOneById(idParent)
          nom=" - "+parent?.nom+nom
          idParent=parent?.idParent
        }
      })
    }
    return nom.substr(3)
  }
  getOneById(id) {
    let l = this.localites?.find(loc => loc.id == id)
    return l ? l : null
  }
}
export interface selectRowInterface {
  code: string;
  libelle: string;
  description: string;
  compteAmort:string,
  compteImmo : string ,
  cumulAmortiss : number,
  dateAcquisition :string,
  dureeUtilite:string,
  dateMiseServ : string,
  dotation : number,
  emplacement : string ,
  etat :string ,
  numeroOrdre :string ,
  taux : number,
  valOrigine :number,
  vnc :number
  localite:any
  endEtat:number;
  status:number;
  lecteur:any
  dateLecture:any
  image:string
}