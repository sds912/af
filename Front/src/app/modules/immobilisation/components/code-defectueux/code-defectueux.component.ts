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
  selector: 'app-code-defectueux',
  templateUrl: './code-defectueux.component.html',
  styleUrls: ['./code-defectueux.component.sass']
})
export class CodeDefectueuxComponent implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('showImmo', { static: false }) showImmo: TemplateRef<any>;
  @ViewChild('formDirective') private formDirective: NgForm;
  @ViewChild('closeEditModal', { static: false }) closeEditModal;
  @ViewChild('closeMatchModal', { static: false }) closeMatchModal;
  @ViewChild('openConfirm', { static: false }) openConfirm;
  @ViewChild('openImmo', { static: false }) openImmo;

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
  statusImmo=3
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
  matchLibelle=""
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
      code: [''],
      oneInput: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {//faire le get status pour les details
    this.firstLoad = true;
    this.myId=localStorage.getItem("idUser")
    this.idCurrentEse=localStorage.getItem("currentEse")
    this.getAllLoc()
    // this.getInventaireByEse();
    this.totalItems = 0;
    this.getImmobilisations(1);
    this.sameComponent()
  }

  getImmobilisations(_page: number) {
    this.page = _page;
    this.securityServ.showLoadingIndicatior.next(true);

    this.immoService.getAllImmosByEntreprise(this.idCurrentEse, this.page, 20, '&status=3').then((res: any) => {
      if (res && res['hydra:member']) {
        this.totalItems = res['hydra:totalItems'];
        this.allImmos = res['hydra:member']?.filter(immo=>immo.localite==null || !this.securityServ.superviseurAdjoint || this.securityServ.superviseurAdjoint && immo.localite?.createur?.id==this.myId);
        this.setData(this.allImmos);
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

  public ngOnDestroy(): void {
    if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
    }
  }
  private subscribeToData(): void {
    this.timerSubscription = combineLatest(timer(5000)).subscribe(() => this.refreshData());
  }
  private refreshData(force?: boolean): void {
    this.getImmos(force);
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
      code: [{value: row.code, disabled: lock}],
      oneInput: [{value: "", disabled: true}]
    });
    this.selectedRowData = row;
  }

  showDetails(row){
    this.details=true
    this.showPhoto=false
    this.editRow(row, true)
  }

  update(row){
    this.details=false
    this.showPhoto=false
    this.editRow(row, false)
  }

  getImmos(force?: boolean) {
    if (this.firstLoad) {
      this.securityServ.showLoadingIndicatior.next(true);
      this.firstLoad = false;
    }
    this.immoService.getImmobilisationByInventaire(this.idCurrentInv,'status=3').then((e) => {
      this.allImmos = e?.filter(immo=>immo.localite==null || !this.securityServ.superviseurAdjoint || this.securityServ.superviseurAdjoint && immo.localite?.createur?.id==this.myId);
      if (force || (this.data.length != this.allImmos.length)) {
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
        this.getAffectationByInv(this.idCurrentInv);
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
  
  getAllLoc() {
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

  getChefEquipOf(idLoc):string{
    const aff= this.affectations.find(aff=>aff.localite.id==idLoc && aff.user.roles[0]=='ROLE_CE')       
    return aff?.user?.nom ?? "À préciser"
  }

  save(match=false){
    const code=this.editForm.value.code
    const id=this.editForm.value.id
    this.securityServ.showLoadingIndicatior.next(true);
    this.inventaireServ.addCode({id:id,code:code,match:match}).then(
      ()=>{
        this.showNotification('bg-success','Enregistré','top','center')
        // this.refreshData(true);
        // this.securityServ.showLoadingIndicatior.next(false);
        this.getImmobilisations(this.page);
        this.closeEditModal.nativeElement.click();
        this.closeMatchModal.nativeElement.click();
      },
      error=>{
        this.showNotification('bg-danger',error,'top','center');
        this.securityServ.showLoadingIndicatior.next(false);
      }
    )
  }

  async saveTreatment(){
    this.matchLibelle=""
    const code=this.editForm.value.code
    const id=this.editForm.value.id
    const match=await this.immoService.getImmobilisationByInventaire(this.idCurrentInv,`code=${code}&status[null]=true`)
    const immo=match[0] ?? null
    if(immo && immo.id!=id){
      this.matchLibelle=immo.libelle
      this.closeEditModal.nativeElement.click();
      this.openConfirm.nativeElement.click();
      return ''
    }
    this.showNotification('bg-danger','Ce code n\'existe pas ou appartient à une immobilisation déjà scannée.','top','center');
    // this.save()
  }

  offMatchedImmo(){
    this.selectedRowData.code=this.editForm.value.code
    this.update(this.selectedRowData)
    this.openImmo.nativeElement.click();
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
  matchedImmo:any
}
