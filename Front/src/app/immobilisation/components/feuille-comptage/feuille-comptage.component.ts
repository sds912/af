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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-feuille-comptage',
  templateUrl: './feuille-comptage.component.html',
  styleUrls: ['./feuille-comptage.component.sass']
})
export class FeuilleComptageComponent implements OnInit {
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
  statusImmo=1
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
  entreprise=null
  constructor(private immoService: ImmobilisationService,
    private sharedService: SharedService,
    private securityServ: SecurityService,
    private inventaireServ: InventaireService,
    private fb: FormBuilder, 
    private _snackBar: MatSnackBar,
    public router: Router,
    public route:ActivatedRoute,
    private adminServ: AdminService,
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
    this.myId=localStorage.getItem("idUser")
    this.idCurrentEse=localStorage.getItem("currentEse")
    this.getInventaireByEse();
    this.sameComponent()
    this.getOneEntreprise()
  }
  sameComponent(){
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd && event.url=='/traitement/reload') {//apres changement de la route
        this.router.navigateByUrl('/traitement')//si import fichier, le ngOnInit se charge du reste
      }
    });
  }
  getOneEntreprise() {
    this.adminServ.getOneEntreprise(this.idCurrentEse).then(
      rep => {
        this.localites = rep?.localites ?? []
        this.entreprise = rep
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  getStatus(status):string{
    let text=""
    if(status==-1){
      text="Immobilisations non scannées"
    }else if(status==0){
      text="Immobilisations scannées non réconciliées"
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
        this.getAffectationByInv(this.idCurrentInv);
        this.getImmos();
        this.securityServ.showLoadingIndicatior.next(false);
      }, error => {
        this.securityServ.showLoadingIndicatior.next(false);
        console.log(error)
      })
  }
  getAffectationByInv(id:number){
    this.planingServ.getAffectations("?inventaire.id="+id).then(
      rep=>{
        this.affectations=rep
      },
      error=>console.log(error)
    )
  }
  getChefEquipOf(idLoc):string{
    const aff= this.affectations.find(aff=>aff.localite.id==idLoc && aff.user.roles[0]=='ROLE_CE')       
    return aff?.user?.nom ?? ""
  }
  getSupadjoint(localite){
    return localite?.createur?.nom ?? ''
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

  generatePdf(data, type) {
    let content = []
    if (this.securityServ.superviseurGene || this.securityServ.superviseurAdjoint)
      content = [this.pdfFeuille(true)]
    else 
      content = [this.onlySup(data)]
    const documentDefinition = {
      content: content, styles: this.getStyle(), pageMargins: [40, 40], pageOrientation: 'landscape',
    };
    pdfMake.createPdf(documentDefinition).open();
  }
  getImage() {
    if (this.entreprise.image && this.entreprise.image != IMAGE64) return [{ image: this.entreprise.image, width: 75 }]
    return [{}]
  }
  getEntete() {
    const e = this.entreprise
    let k = e.capital ? this.sharedService.numStr(e.capital, ' ') + " FCFA" : ""
    return [
      [
        { text: "" + e.denomination, border: [false, false, false, false], margin: [-5, 0, 0, 0] }
      ],
      [
        { text: "" + e.republique + "/" + e.ville, border: [false, false, false, false], margin: [-5, 0, 0, 0] }
      ]
    ]
  }
  getStyle() {
    return {
      fsize: {
        fontSize: 6.5,
      },
      enTete: {
        fontSize: 6.5,
        fillColor: '#eeeeee',
      },
      enTete2: {
        fontSize: 6.5,
        bold: true,
        fillColor: '#bcbdbc',
      },
      gris: {
        fillColor: '#bcbdbc'
      },
      grasGris: {
        bold: true,
        fillColor: '#e6e6e6'
      },
      grasGrisF: {
        bold: true,
        fillColor: '#b5b3b3'
      },
      gras: {
        bold: true
      },
      centerGG: {
        bold: true,
        fillColor: '#e6e6e6',
        alignment: 'center'
      },
      no_border: {
        border: false
      }
    }
  }
  pdfFeuille(supervAdjoint) {
    let content=null
    if(this.statusImmo==-1){
      content=this.getContentNonScanne(this.data)
    }else{
      content=supervAdjoint?this.getContentSupAdjointExist(this.data):this.getContentOnLySup(this.data)
    }
    
    return [
      ...this.getImage(),
      {
        table: {
          width: ['*'],
          body: [
            ...this.getEntete(),
            [
              { text: '', margin: [2, 7], border: [false, false, false, false] }
            ]
          ]
        }, margin: [0, 10, 0, 0]
      },
      {
        table: {
          widths: content.widths,
          body: content.body
        }, margin: [0, 0, 0, 0]
      }
    ]
  }
  getContentSupAdjointExist(data){//0 - 1 - 2
    const title="FEUILLE DE COMPTAGE DES "+this.getStatus(this.statusImmo).replace(/é/gi,"e").toUpperCase()
    return {
      widths: [100,100,50,150,90,42,90,95],
      body: [
        [
          { text: title,decoration: 'underline', margin: [0,0,0, 20],alignment: 'center',colSpan:8, border: [false, false, false, false]},
          {},{},{},{},{},{},{}
        ],
        [
          { text: 'Code' ,fontSize:10},
          { text: 'Libellé' ,fontSize:10},
          { text: 'Etat' ,fontSize:10},
          { text: 'Emplacement' ,fontSize:10},
          { text: 'Lecteur' ,fontSize:10},
          { text: 'Date' ,fontSize:10},
          { text: "Chef d'équipe" ,fontSize:10},
          { text: 'Superviseur Adjoint' ,fontSize:10}
        ],
        ...this.rows(data)
      ]
    }
  }
  getContentOnLySup(data){//0 - 1 - 2
    const title="FEUILLE DE COMPTAGE DES "+this.getStatus(this.statusImmo).replace(/é/gi,"e").toUpperCase()
    return {
      widths: [110,100,55,200,90,55,90],
      body: [
        [
          { text: title,decoration: 'underline', margin: [0,0,0, 20],alignment: 'center',colSpan:8, border: [false, false, false, false]},
          {},{},{},{},{},{},{}
        ],
        [
          { text: 'Code' ,fontSize:10},
          { text: 'Libellé' ,fontSize:10},
          { text: 'Etat' ,fontSize:10},
          { text: 'Emplacement' ,fontSize:10},
          { text: 'Lecteur' ,fontSize:10},
          { text: 'Date' ,fontSize:10},
          { text: "Chef d'équipe" ,fontSize:10}
        ],
        ...this.rows(data,false)
      ]
    }
  }
  rows(data,supAdjoint=true){
    let tab=[]
    data.forEach(immo => {
      let d=[
        { text: immo.code ,fontSize:8},
        { text: immo.libelle ,fontSize:8},
        { text: this.getEtat(immo.endEtat) ,fontSize:8},
        { text: this.locName(immo.localite.id) ,fontSize:8},
        { text: immo.lecteur.nom ,fontSize:8},
        { text: this.formattedDate(immo.dateLecture) ,fontSize:8},
        { text: this.getChefEquipOf(immo.localite.id) ,fontSize:8}
      ]
      if(supAdjoint){d.push({ text: this.getSupadjoint(immo.localite) ,fontSize:8})}
      tab.push(d)
    }
    );
    return tab
  }
  getContentNonScanne(data){//- 1
    const title="FEUILLE DE COMPTAGE DES "+this.getStatus(this.statusImmo).replace(/é/gi,"e").toUpperCase()
    return {
      widths: [110,200,88,88,75,100,50],
      body: [
        [
          { text: title,decoration: 'underline', margin: [0,0,0, 20],alignment: 'center',colSpan:7, border: [false, false, false, false]},
          {},{},{},{},{},{}
        ],
        [
          { text: 'Code' ,fontSize:10,alignment: 'center'},
          { text: 'Libellé' ,fontSize:10,alignment: 'center'},
          { text: "Valeur d'origine" ,fontSize:10,alignment: 'center'},
          { text: 'VNC' ,fontSize:10,alignment: 'center'},
          { text: 'Date acquisition' ,fontSize:10,alignment: 'center'},
          { text: 'Emplacement' ,fontSize:10,alignment: 'center'},
          { text: "Etat" ,fontSize:10,alignment: 'center'}
        ],
        ...this.rowsNonScanne(data)
      ]
    }
  }
  rowsNonScanne(data){
    let tab=[]
    data.forEach(immo => {
      let d=[
        { text: immo.code ,fontSize:8},
        { text: immo.libelle ,fontSize:8},
        { text: immo.valOrigine ,fontSize:8},
        { text: immo.vnc ,fontSize:8},
        { text: this.formattedDate(immo.dateAcquisition) ,fontSize:8},
        { text: immo.emplacement ,fontSize:8},
        { text: immo.etat ,fontSize:8}
      ]
      tab.push(d)
    }
    );
    return tab
  }
  formattedDate(d = new Date) {
    d = new Date(d)
    return [d.getDate() , d.getMonth() + 1, d.getFullYear()].map(n => n < 10 ? `0${n}` : `${n}`).join('-');
  }
  onlySup(data) {
    return [
      ...this.getImage(),
      {
        table: {
          width: ['*'],
          body: [
            ...this.getEntete(),
            [
              { text: '', margin: [2, 7], border: [false, false, false, false] }
            ],
          ]
        }, margin: [0, 10, 0, 0]
      }
    ]
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