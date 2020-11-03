import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ImmobilisationService } from '../../services/immobilisation.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { InventaireService } from 'src/app/inventaire/service/inventaire.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IMAGE64 } from 'src/app/administration/components/entreprise/image';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PlaningService } from 'src/app/planing/services/planing.service';
@Component({
  selector: 'app-ajuster-fi',
  templateUrl: './ajuster-fi.component.html',
  styleUrls: ['./ajuster-fi.component.sass']
})
export class AjusterFiComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('showImmo', { static: false }) showImmo: TemplateRef<any>;
  @ViewChild('formDirective') private formDirective: NgForm;
  @ViewChild('closeEditModal', { static: false }) closeEditModal;
  @ViewChild('closeConfirmModal', { static: false }) closeConfirmModal;
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
  statusImmo=2
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
  approuvText=""
  isUpdate=false
  confirmationValue=false
  constructor(private immoService: ImmobilisationService,
    private sharedService: SharedService,
    public securityServ: SecurityService,
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
      endLibelle:  [''],
      endDescription:  [''],
      compteAmort:  [''],
      compteImmo :  [''],
      cumulAmortiss :  [''],
      dateAcquisition :  [''],
      dureeUtilite:  [''],
      dateMiseServ :  [''],
      dotation :  [''],
      emplacement :  [''],
      etat :  [''],
      numeroOrdre :  [''],
      taux :  [''],
      valOrigine :  [''],
      vnc :  [''],
      localite:  [''],
      endEtat: [''],
      status: [''],
      lecteur: [''],
      dateLecture: [''],
      image: ['']
    });
  }

  ngOnInit(): void {//faire le get status pour les details
    this.myId=localStorage.getItem("idUser")
    this.idCurrentEse=localStorage.getItem("currentEse")
    this.getAllLoc()
    this.getInventaireByEse();
    this.sameComponent()
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
    this.securityServ.superviseurGene?lock=true:null
    this.editForm = this.fb.group({
      id: [{value: row.id, disabled: lock}],
      code: [{value: row.code, disabled: lock}],
      endLibelle:  [{value: row.endLibelle, disabled: lock}],
      endDescription:  [{value: row.endDescription, disabled: lock}],
      compteAmort:  [{value: row.compteAmort, disabled: lock}],
      compteImmo :  [{value: row.compteImmo, disabled: lock}],
      cumulAmortiss :  [{value: row.cumulAmortiss, disabled: lock}],
      dateAcquisition :  [{value: row.dateAcquisition, disabled: lock}],
      dureeUtilite:  [{value: row.dureeUtilite, disabled: lock}],
      dateMiseServ :  [{value: row.dateMiseServ, disabled: lock}],
      dotation :  [{value: row.dotation, disabled: lock}],
      emplacement :  [{value: row.emplacement, disabled: lock}],
      etat :  [{value: row.etat, disabled: lock}],
      numeroOrdre :  [{value: row.numeroOrdre, disabled: lock}],
      taux :  [{value: row.taux, disabled: lock}],
      valOrigine :  [{value: row.valOrigine, disabled: lock}],
      vnc :  [{value: row.vnc, disabled: lock}],
      localite:  [{value: row.localite.nom, disabled: true}],
      endEtat: [{value: this.getEtat(row.endEtat), disabled: true}],
      status: [{value: row.status, disabled: lock}],
      lecteur: [{value: row.lecteur?.nom, disabled: true}],
      dateLecture: [{value: row.dateLecture, disabled: true}],
      image: [{value: row.image, disabled: lock}]
    });
    this.selectedRowData = row;
  }

  showDetails(row){
    this.details=true
    this.showPhoto=false
    this.isUpdate=false
    this.editRow(row, true)
  }

  update(row){
    this.details=false
    this.showPhoto=false
    this.isUpdate=true
    this.editRow(row, false)
  }

  getImmos() {
    this.securityServ.showLoadingIndicatior.next(true);
    this.immoService.getImmobilisationByInventaire(this.idCurrentInv).then((e) => {
      this.allImmos = e?.filter(immo=>this.securityServ.superviseurAdjoint && immo.localite?.createur.id==this.myId || !this.securityServ.superviseurAdjoint);
      this.setData(this.allImmos)
      this.securityServ.showLoadingIndicatior.next(false);
      if(this.route.snapshot.params["id"]){
        const immo=this.allImmos.find(im=>im.id==this.sharedService.decodId(this.route.snapshot.params["id"]))        
        this.update(immo)
        this.openImmo.nativeElement.click();
      }
    }, error => {
      this.securityServ.showLoadingIndicatior.next(false);
      console.log(error)
    });
  }
  close(){
    if(this.route.snapshot.params["id"]){
      this.router.navigate(["/ajuster/fi"])
    }
  }
  setData(data){
    this.data=data?.filter(immo=>this.statusImmo!=-1 && immo.status==this.statusImmo ||this.statusImmo==-1 && immo.status==null)
    console.log(this.data);
    
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
        this.getImmos();
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
  
  getAllLoc(){
    this.inventaireServ.getLocalitesOfEse(this.idCurrentEse).then(localites=>this.localites=localites)
  }

  inventaireChange(id) {
    this.idCurrentInv=this.inventaires.find(inv=>inv.id==id)?.id   
    this.getAffectationByInv(this.idCurrentInv); 
    this.getImmos();
  }

  showDialogImmo() {
    this.showImmo.elementRef.nativeElement.click();
  }

  filtreImmoChange(){
    this.data=this.filteredData?.filter(immo=>
      (this.statusImmo!=-1 && this.statusImmo!=4 && immo.status==this.statusImmo ||
      this.statusImmo==-1 && immo.status==null || this.statusImmo==4 && immo.localite && immo.emplacement?.toLowerCase()!=immo.localite.nom?.toLowerCase()) 
      && (immo.endEtat==this.typeImmo || this.typeImmo==""))
      console.table(this.data);
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

  save(soumettre){
    const data=this.clearData(this.editForm.value)
    data.soumettre=soumettre
    data.approvStatus=soumettre?0:-1
    this.securityServ.showLoadingIndicatior.next(true);
    data.valOrigine=data.valOrigine?data.valOrigine:0
    this.immoService.postImmobilisation(data).then(
      ()=>{
        this.showNotification('bg-success',soumettre?'Ajustement soumis pour approbation':'Enregistré','top','center')
        this.getImmos()
        this.securityServ.showLoadingIndicatior.next(false);
        this.closeEditModal.nativeElement.click();
      },
      error=>{
        this.showNotification('bg-danger',error,'top','center');
        this.securityServ.showLoadingIndicatior.next(false);
      }
    )
  }



  clearData(data){
    /** because they are disabled */
    data.localite="/api/localites/"+this.selectedRowData.localite?.id
    data.endEtat=this.selectedRowData.endEtat
    data.lecteur="/api/users/"+this.selectedRowData.lecteur?.id
    data.dateLecture=this.selectedRowData.dateLecture
    if(this.securityServ.superviseurAdjoint){
      data.ajusteur="/api/users/"+this.myId
      data.approvStatus=0
    }
    return data
  }

  approve(value){
    this.confirmationValue=value
    this.approuvText=value?"Voulez-vous approuver cet ajustement ?":"Voulez-vous rejeter cet ajustement ?"
    this.closeEditModal.nativeElement.click();
    this.openConfirm.nativeElement.click();
  }
  sendConfirmation(){
    const approvStatus=this.confirmationValue?"1":"2"
    this.securityServ.showLoadingIndicatior.next(true);
    this.immoService.approveAjustement(this.selectedRowData.id,approvStatus).then(
      ()=>{
        this.immoService.approvChange.next(true);
        this.showNotification('bg-success','Enregistré','top','center')
        this.securityServ.showLoadingIndicatior.next(false);
        this.closeConfirmModal.nativeElement.click();
        this.router.navigate(["/ajuster/fi"])
        this.getImmos()
      },
      error=>{
        this.showNotification('bg-danger',error,'top','center');
        this.securityServ.showLoadingIndicatior.next(false);
      }
    )
  }

  offConfirmation(){
    this.selectedRowData.code=this.editForm.value.code
    this.update(this.selectedRowData)
    this.openImmo.nativeElement.click();
  }
  deleteIdInUrl(){
    if(this.route.snapshot.params["id"]){
      this.router.navigate(["/ajuster/fi"])
    }
  }
}
export interface selectRowInterface {
  id:number
  code: string;
  libelle: string;
  description: string;
  endLibelle: string;
  endDescription: string;
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
  ajusteur:any
  approvStatus:number
}
