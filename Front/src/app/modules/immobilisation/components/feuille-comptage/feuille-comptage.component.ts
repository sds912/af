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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as ExcelProper from "exceljs";
import * as fs from 'file-saver';
import { timer, combineLatest } from 'rxjs';
import { EntrepriseService } from 'src/app/data/services/entreprise/entreprise.service';

let workbook: ExcelProper.Workbook = new Excel.Workbook();
@Component({
  selector: 'app-feuille-comptage',
  templateUrl: './feuille-comptage.component.html',
  styleUrls: ['./feuille-comptage.component.sass']
})
export class FeuilleComptageComponent implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('showImmo', { static: false }) showImmo: TemplateRef<any>;
  @ViewChild('formDirective') private formDirective: NgForm;
  workbook=workbook

  dateInv=null

  inputMobilFile=null


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
  statusImmo=-2
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
  users= [];
  afterAjustement=false
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
    private adminServ: AdminService,
    private planingServ: PlaningService,
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

  ngOnInit(): void {//faire le get status pour les details
    this.firstLoad = true;
    this.afterAjustement=this.route.snapshot.params["type"]=="ajustees"?true:false
    this.myId=localStorage.getItem("idUser")
    this.idCurrentEse=localStorage.getItem("currentEse")
    this.idCurrentInv = localStorage.getItem("currentInv");
    // this.getInventaireByEse();
    this.totalItems = 0;
    this.getImmobilisations(1);
    this.sameComponent()
    this.getOneEntreprise()
  }

  getImmobilisations(_page: number, filters?: any) {
    this.page = _page;
    this.securityServ.showLoadingIndicatior.next(true);

    this.immoService.getAllImmosByEntreprise(this.idCurrentEse, this.page, 20, filters).then((res: any) => {
      if (res && res['hydra:member']) {
        this.totalItems = res['hydra:totalItems'];
        this.allImmos = res['hydra:member']?.filter(immo=>immo.localite==null || 
          this.securityServ.superviseur || this.securityServ.superviseurGene || 
          this.securityServ.superviseurAdjoint && immo.localite?.createur?.id==this.myId  ||
          this.securityServ.chefEquipe && immo?.localite && this.isAffected(immo?.localite?.id)
        );
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
    this.statusImmo = status;
    let filters = `&status=${this.statusImmo}`;
    if (this.statusImmo == -1) {
      filters = `&status[null]=true`;
    }
    this.getImmobilisations(this.page, filters);
  }

  public ngOnDestroy(): void {
    if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
    }
  }
  private subscribeToData(): void {
    this.timerSubscription = combineLatest(timer(2000)).subscribe(() => this.refreshData());
  }
  private refreshData(): void {
    this.getImmos();
    // this.subscribeToData();
  }
  sameComponent(){
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd && event.url=='/feuille/comptage/reload') {//apres changement de la route
        this.router.navigateByUrl('/feuille/comptage')//si import fichier, le ngOnInit se charge du reste
      }
    });
  }
  getOneEntreprise() {
    this.adminServ.getOneEntreprise(this.idCurrentEse).then(
      rep => {
        this.localites = rep?.localites ?? []
        this.entreprise = rep
        this.users= rep?.users        
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
    if (this.firstLoad) {
      this.securityServ.showLoadingIndicatior.next(true);
      this.firstLoad = false;
    }
    this.immoService.getImmobilisationByInventaire(this.idCurrentInv).then((e) => {
      this.allImmos = e?.filter(immo=>immo.localite==null || 
        this.securityServ.superviseur || this.securityServ.superviseurGene || 
        this.securityServ.superviseurAdjoint && immo.localite?.createur?.id==this.myId  ||
        this.securityServ.chefEquipe && immo?.localite && this.isAffected(immo?.localite?.id)
      );
      if (this.data.length != this.allImmos.length) {
        this.setData(this.allImmos);
      }
      this.securityServ.showLoadingIndicatior.next(false);
    }, error => {
      this.securityServ.showLoadingIndicatior.next(false);
    });
  }
  isAffected(idLoc):boolean{
    return this.affectations.find(aff=>aff?.localite?.id==idLoc)?true:false
  }

  setData(data){
    this.data=data?.filter(immo=>this.statusFilter(immo))
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
        this.refreshData();
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
    return aff?.user?.nom ?? "À préciser"
  }

  getSupadjoint(localite){
    return localite?.createur?.nom ?? ''
  }

  showDialogImmo() {
    this.showImmo.elementRef.nativeElement.click();
  }

  filtreImmoChange(){
    this.data=this.filteredData?.filter(immo=>this.statusFilter(immo))    
  }
  statusFilter(immo):boolean{
    const cas1=this.statusImmo!=-1 && this.statusImmo!=4 && immo.status==this.statusImmo && !(immo.status==1 && immo.isMatched && !this.afterAjustement)
    const cas2=this.statusImmo==-1 && immo.status==null
    const cas3=this.statusImmo==-1 && immo.status==1 && immo.isMatched && !this.afterAjustement
    const cas4=this.statusImmo==4 && immo.localite && immo.emplacement?.toLowerCase()!=immo.localite.nom?.toLowerCase()
    const cas5=this.statusImmo==-2//tous
    const type=(immo.endEtat==this.typeImmo || this.typeImmo=="" || this.typeImmo!="" && this.statusImmo==-1)
    return (cas1||cas2||cas3||cas4||cas5)  && type
  }

  filterDatatable(value) {
    // get the value of the key pressed and make it lowercase
    const val = value.toLowerCase();
    this.data = this.filteredData.filter(immo=>
      (immo.libelle?.toLowerCase().search(val)>=0 ||
      immo.lecteur?.nom.toLowerCase().search(val)>=0 ||
      immo.localite?.nom.toLowerCase().search(val)>=0 ||
      immo.code?.toLowerCase().search(val)>=0) && this.statusFilter(immo)
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

  generatePdf() {
    const documentDefinition = {
      content: [this.pdfFeuille(this.securityServ.superviseur?false:true)], styles: this.getStyle(), pageMargins: [40, 40], pageOrientation: 'landscape',
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  getImage() {
    if (this.entreprise && this.entreprise.image && this.entreprise.image != IMAGE64) return [{ image: this.entreprise.image, width: 75 }]
    return [{}]
  }

  getEntete() {
    const e = this.entreprise
    let k = e.capital ? this.sharedService.numStr(e.capital, ' ') + " FCFA" : ""
    const inv=this.inventaires.find(inventaire=>inventaire.id==this.idCurrentInv)
    const superviseur=this.users.find(user=>user.roles[0]==='ROLE_SuperViseurGene' ||user.roles[0]==='ROLE_Superviseur')
    const general=superviseur?.roles[0]==='ROLE_SuperViseurGene'?"Général":""
    // const title="FEUILLE DE COMPTAGE DES "+this.getStatus(this.statusImmo).replace(/é/gi,"e").toUpperCase()
    const title=this.getStatus(this.statusImmo).replace(/é/gi,"e").toUpperCase()

    return [
      [
        { text: e.denomination, border: [false, false, false, false], margin: [-5, 0, 0, 0], colSpan:2 },{}
      ],
      [
        { text: e.republique + "/" + e.ville, border: [false, false, false, false], margin: [-5, 0, 0, 5], colSpan:2 },{}
      ],
      [
        { text: `Période d'inventaire :  Du ${this.formattedDate(inv.debut)} au ${this.formattedDate(inv.fin)}`, border: [false, false, false, false], margin: [-5, 0, 0, 0] },
        { text: `Superviseur ${general} : ${superviseur?.nom ?? ''}`,alignment:"right", border: [false, false, false, false]}
      ],
      [
        { text: title,decoration: 'underline',style:'gras', margin: [0,20,0, 0],alignment: 'center',colSpan:2, border: [false, false, false, false]},{}
      ],
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
          widths: ['*','*'],
          body: [
            ...this.getEntete(),
            [
              { text: '', margin: [2, 7], border: [false, false, false, false], colSpan:2 },{}
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
    let entete=[
      { text: 'Libellé' ,fontSize:10, alignment: 'center', style:"grasGris"},
      { text: 'Etat' ,fontSize:10, alignment: 'center', style:"grasGris"},
      { text: 'Emplacement' ,fontSize:10, alignment: 'center', style:"grasGris"},
      { text: 'Lecteur' ,fontSize:10, alignment: 'center', style:"grasGris"},
      { text: 'Date' ,fontSize:10, alignment: 'center', style:"grasGris"},
      { text: "Chef d'équipe" ,fontSize:10, alignment: 'center', style:"grasGris"},
      { text: 'Superviseur Adjoint' ,fontSize:10, alignment: 'center', style:"grasGris"}
    ]
    let widths=[100,50,230,85,45,90,95]
    if(this.statusImmo!=3){
      entete=[{ text: 'Code' ,fontSize:10, alignment: 'center', style:"grasGris"},...entete]
      widths=[100,100,50,150,85,45,85,95]
    }
    return {
      widths: widths,
      body: [entete,...this.rows(data)]
    }
  }
  getContentOnLySup(data){//0 - 1 - 2
    let entete=[
      { text: 'Libellé' ,fontSize:10, alignment: 'center', style:"grasGris"},
      { text: 'Etat' ,fontSize:10, alignment: 'center', style:"grasGris"},
      { text: 'Emplacement' ,fontSize:10, alignment: 'center', style:"grasGris"},
      { text: 'Lecteur' ,fontSize:10, alignment: 'center', style:"grasGris"},
      { text: 'Date' ,fontSize:10, alignment: 'center', style:"grasGris"},
      { text: "Chef d'équipe" ,fontSize:10, alignment: 'center', style:"grasGris"},
    ]
    let widths=[100,55,250,120,55,120]
    if(this.statusImmo!=3){
      entete=[{ text: 'Code' ,fontSize:10, alignment: 'center', style:"grasGris"},...entete]
      widths=[110,100,55,200,90,55,90]
    }
    return {
      widths: widths,
      body: [entete,...this.rows(data,false)]
    }
  }
  rows(data,supAdjoint=true){
    let tab=[]
    data.forEach(immo => {
      let d=[
        { text: this.afterAjustement?immo.endLibelle:immo.libelle ,fontSize:8},
        { text: this.getEtat(immo.endEtat) ,fontSize:8},
        { text: immo.localite ? this.locName(immo.localite.id) : '' ,fontSize:8},
        { text: immo.lecteur ? immo.lecteur.nom : '' ,fontSize:8},
        { text: this.formattedDate(immo.dateLecture) ,fontSize:8},
        { text: immo.localite ? this.getChefEquipOf(immo.localite.id) : '',fontSize:8}
      ]
      if(this.statusImmo!=3)d=[{ text: immo.code?immo.code:"-" ,fontSize:8},...d]
      if(supAdjoint){d.push({ text: immo.localite ? this.getSupadjoint(immo.localite) : '',fontSize:8})}
      tab.push(d)
    }
    );
    return tab
  }
  getContentNonScanne(data){//- 1
    return {
      widths: [110,200,88,88,75,100,50],
      body: [
        [
          { text: 'Code' ,fontSize:10, alignment: 'center', style:"grasGris"},
          { text: 'Libellé' ,fontSize:10,alignment: 'center', style:"grasGris"},
          { text: "Valeur d'origine" ,fontSize:10,alignment: 'center', style:"grasGris"},
          { text: 'VNC' ,fontSize:10,alignment: 'center', style:"grasGris"},
          { text: 'Date acquisition' ,fontSize:10,alignment: 'center', style:"grasGris"},
          { text: 'Empl. théorique' ,fontSize:10,alignment: 'center', style:"grasGris"},
          { text: "Etat" ,fontSize:10,alignment: 'center', style:"grasGris"}
        ],
        ...this.rowsNonScanne(data)
      ]
    }
  }
  rowsNonScanne(data){
    let tab=[]
    data.forEach(immo => {
      tab.push([
        { text: immo.code ,fontSize:8},
        { text: immo.libelle ,fontSize:8},
        { text: immo.valOrigine?this.numbStr(immo.valOrigine):"-" , fontSize:8, alignment:'right'},
        { text: immo.vnc?this.numbStr(immo.vnc):"-" ,fontSize:8, alignment:'right'},
        { text: this.formattedDate(immo.dateAcquisition) ,fontSize:8},
        { text: immo.emplacement ,fontSize:8},
        { text: immo.etat ,fontSize:8}
      ])
    }
    );
    return tab
  }
  formattedDate(d = new Date) {
    d = new Date(d)
    return [d.getDate() , d.getMonth() + 1, d.getFullYear()].map(n => n < 10 ? `0${n}` : `${n}`).join('/');
  }
  numbStr(number){
    return this.sharedService.numStr(number," ")
  }

  convertBase64ToBlobData(base64Data: string, contentType: string='application/octet-stream', sliceSize=512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  generateExcel(){
    const dataExport = {
      table: 'immobilisations',
      entreprise: this.idCurrentEse,
      inventaire: this.idCurrentInv
    }
    console.log(dataExport);
    this.entrepriseService.exportImmobilisations(dataExport).subscribe((res: any) => {
      const blobData = this.convertBase64ToBlobData(res['file']);
      fs.saveAs(blobData, res['fileName']);
    });
    return;
    const data:selectRowInterface[]=this.allImmos
    //https://www.ngdevelop.tech/export-to-excel-in-angular-6/
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Immobilisations'); //nouvelle feuille
    let headerRow = worksheet.addRow(["Numéro d'ordre","Code","Compte d'immobilisation","Compte d'amortissement","Emplacement théorique","Description","Date d'acquisition","Date de mise en service","Durée d'utilité","Taux","Valeur d'origine","Dotation de l'exercice","Amortissements cumulés","VNC","Etat du bien théorique","Statut du bien","Etat réel du bien","Emplacement réel","ID localité","Lecteur","Date de comptage"]);//une ligne et les colonnes
    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('B').width = 30;
    worksheet.getColumn('D').width = 30;
    worksheet.getColumn('E').width = 30;
    worksheet.getColumn('F').width = 40;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 27;
    worksheet.getColumn('I').width = 15;
    worksheet.getColumn('J').width = 15;
    worksheet.getColumn('K').width = 20;
    worksheet.getColumn('L').width = 30;
    worksheet.getColumn('M').width = 30;
    worksheet.getColumn('N').width = 20;
    worksheet.getColumn('O').width = 27;
    worksheet.getColumn('P').width = 50;
    worksheet.getColumn('Q').width = 20;
    worksheet.getColumn('R').width = 50;
    worksheet.getColumn('S').width = 15;
    worksheet.getColumn('T').width = 25;
    worksheet.getColumn('U').width = 20;
    headerRow.eachCell((cell, number) => {//pour chaque cellules de l'entete
       cell.fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: 'eeeeee' },
         bgColor: { argb: 'eeeeee' }
         //https://www.colorhexa.com/d5d5cf
       }
       cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }//pour la bordure
       cell.font = {size: 13, bold: true };
    });
    data.forEach(d => {
      if(!d.status || d.status!=3 && d.status!=2 && d.status!=0 || d.status==3 && !d.isMatched || (d.status==2||d.status==0) && d.approvStatus==1){
        let status=this.getStatus(d.status)//si match avec immo code def changer
        if(d.status==1 && d.isMatched){
          status=this.getStatus(3)
          //le colorier
        }
        let row = worksheet.addRow([
          d.numeroOrdre??" ",d.code??" ",d.compteImmo??" ",d.compteAmort??" ",d.emplacement??" ",d.endLibelle??" ",this.formattedDate(d.dateAcquisition)??" ",this.formattedDate(d.dateMiseServ)??" ",d.dureeUtilite??" ",d.taux??0,
          d.valOrigine??0,d.dotation??0,d.cumulAmortiss??0,d.vnc??0,d.etat??" ",d.status?status:"Immobilisations non scannées",d.status?this.getEtat(d.endEtat):" ",d.localite?this.locName(d.localite?.id):" ",
          d.localite?.id??" ",d.lecteur?.nom??" ",d.dateLecture?this.formattedDate(d.dateLecture):" "]
        );
        row.eachCell((cell, number) =>cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } })
        const cas0=d.status==0
        const cas1=d.status==1 && d.isMatched
        const cas2=d.status==2
        const cas3=d.status==3
        if(cas0 || cas1 || cas2 || cas3){
          row.eachCell((cell, number) => {//pour chaque cellules de l'entete
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFF00' },
              bgColor: { argb: 'FF0000FF' }
            }
          });
        }
      
      }
    });
    
    workbook.xlsx.writeBuffer().then((data) => {
       let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });       
       fs.saveAs(blob, `Fichier des immobilisations ajusté au ${this.getExcelDate()}.xlsx`);
    });    
  }
  getExcelDate():string{
    return this.formattedDate(this.inventaires.find(inv=>inv.id==this.idCurrentInv)?.dateInv)
  }

  importMobileFile(event){
    this.dateInv=null
    let selectedFile = event.target.files[0];
    this.inputMobilFile=null
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF-8");
    fileReader.onload = () => {
      const obj:string=typeof fileReader.result=="string"?fileReader.result:""
      this.saveData(JSON.parse(obj))
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }
  saveData(data){
    console.log(data);
    this.getInventaireById(data.inventaire.id,data)
  }
  getInventaireById(id,data){
    if(id){
      this.inventaireServ.getInventaireById(id).then(
        rep=>{
          this.thraitement(rep,data)
        },
        error=>{
          console.log(error);  
          this.showNotification('bg-red',"Fichier incorrect.",'top','center',5000)
        }
      )
      return ''
    }
    this.showNotification('bg-red',"Fichier incorrect.",'top','center',5000)
  }

  thraitement(rep,data){
    this.dateInv=rep.dateInv
    this.idCurrentEse = localStorage.getItem("currentEse")//laisser ici
    console.log(rep,this.idCurrentEse);
    if(rep.entreprise.id!=this.idCurrentEse){
      this.showNotification('bg-red',"Cet inventaire n'est pas rattaché à l'entité dans lequel vous êtes connecté.",'top','center',7000)
    }else if(rep.status=='close'){
      this.showNotification('bg-red',"Cet inventaire est déja cloturé.",'top','center',7000)
    }else{
      this.inventaireServ.sendMobileData(data).then(
        ()=>{
          this.showNotification('bg-success',"Enregistré",'top','center',5000)
          this.router.navigate(['/feuille/comptage/reload'])
        },error=>this.showNotification('bg-red',error,'top','center',5000)
      )
    }
  }
  
}
export interface selectRowInterface {
  code: string;
  libelle: string;
  description: string;
  endLibelle: string;
  endDescription: string;
  compteAmort:string,
  compteImmo : string ,
  cumulAmortiss : number,
  dateAcquisition :any,
  dureeUtilite:string,
  dateMiseServ : any,
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
  isMatched:boolean
  approvStatus:number
}