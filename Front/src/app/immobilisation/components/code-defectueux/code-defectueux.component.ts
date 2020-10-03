import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ImmobilisationService } from '../../services/immobilisation.service';
import { AdminService } from 'src/app/administration/service/admin.service';
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
  selector: 'app-code-defectueux',
  templateUrl: './code-defectueux.component.html',
  styleUrls: ['./code-defectueux.component.sass']
})
export class CodeDefectueuxComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('showImmo', { static: false }) showImmo: TemplateRef<any>;
  @ViewChild('formDirective') private formDirective: NgForm;
  @ViewChild('closeEditModal', { static: false }) closeEditModal;
  @ViewChild('closeMatchModal', { static: false }) closeMatchModal;

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

  getImmos() {
    this.securityServ.showLoadingIndicatior.next(true);
    this.immoService.getImmobilisationByInventaire(this.idCurrentInv,'status=3').then((e) => {
      this.allImmos = e;
      this.setData(e)
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
    const data={id:id,code:code,match:match}
  }
  async saveTreatment(){
    this.matchLibelle=""
    const code=this.editForm.value.code
    const id=this.editForm.value.id
    const match=await this.immoService.getImmobilisationByInventaire(this.idCurrentInv,`code=${code}`)
    const immo=match[0] ?? null
    if(immo && immo.id!=id){
      this.matchLibelle=immo.libelle
      // hidde this modal open other
      //this.closeEditModal.nativeElement.click();
      alert(`Ce code correspont à l'immobilisation ${this.matchLibelle}, voulez-vous confirmer qu'il s'agit bien de cette immobilisation ?`)
      return ''
    }
    this.save()
  }
  offMatchedImmo(){
    // open the first modal
    this.update(this.selectedRowData)
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
