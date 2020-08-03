import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder, FormControl, Validators,NgForm, FormArray } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdminService } from '../../../administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { InventaireService } from '../../service/inventaire.service';
import { Entreprise } from 'src/app/administration/model/entreprise';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { IMAGE64 } from 'src/app/administration/components/entreprise/image';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-inventaire',
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.sass']
})
export class InventaireComponent implements OnInit {
  @ViewChild('closeComiteModal', { static: false }) closeComiteModal;
  @ViewChild('closePresentModal', { static: false }) closePresentModal;
  @ViewChild('closeLocaliteModal', { static: false }) closeLocaliteModal;
  @ViewChild('formDirective') private formDirective: NgForm;
  isLinear = false;
  imgLink=""
  docLink=""
  inventaires=[]
  idCurrentInv=0
  show=false
  editForm: FormGroup;
  instForm: FormGroup;
  pvForm: FormGroup;
  idPresiComite=0
  instructions=[]
  docsPv=[]
  docsDc=[]
  tabComite=new FormArray([]);
  tabPresents=new FormArray([]);
  tabOtherPresent=new FormArray([]);
  presidents=[]
  membresComite=[]
  users=[]
  myId=""
  entreprises:Entreprise[]=[]
  localites=[]
  idCurrentEse=0
  showForm=false//remettre à false
  tabLoc=[]
  comments=[]
  commentsPv=[]
  invCreer=false
  pvCreer=false
  tabDeliberation=new FormArray([]);
  urlInst=''
  urlPv=''
  locHover=null
  zoneHover=null
  szHover=null
  entreprise=null
  signatairesPv: string[] = [];
  signPvCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  signatairesInst: string[] = [];
  signInstCtrl = new FormControl();
  subdivisions=[]//leurs libelles
  tabOpen=[]
  openLocalite=null
  constructor(private fb: FormBuilder, 
              private _snackBar: MatSnackBar,
              private adminServ:AdminService,
              private sharedService:SharedService,
              private securityServ:SecurityService,
              private inventaireServ:InventaireService) {
    this.imgLink=this.sharedService.baseUrl +"/images/"
    this.docLink=this.sharedService.baseUrl +"/documents/"
  }//afficher que la 1ere sub et modifier Localite par sub[0]
  ngOnInit() {
    this.myId=localStorage.getItem('idUser')
    this.securityServ.showLoadingIndicatior.next(true)
    this.initForm()
    this.initInstrucForm()
    this.comments=this.getCommentInst()
    this.initPvForm()
    this.commentsPv=this.getCommentPv()
    this.getOneEntreprise()
  }
  getOneEntreprise(){
    const idEse=localStorage.getItem("currentEse")
    this.adminServ.getOneEntreprise(idEse).then(
      rep=>{
        let e=rep
        if(e){
          this.idCurrentEse=e.id
          this.localites=rep.localites
          this.getUsers(rep.users)
          this.getInventaireByEse()
          this.subdivisions=e?.subdivisions?e?.subdivisions:[]
          if(this.tabOpen?.length==0)this.subdivisions?.forEach(sub=>this.tabOpen.push(0))
        }
        this.entreprise=rep
        //this.securityServ.showLoadingIndicatior.next(false)
      },
      error=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  getInventaireByEse(add=false){
    this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(
      rep=>{
        this.securityServ.showLoadingIndicatior.next(false)//ne pas sup sinon revoir celui de onEditSave
        let inv=rep
        if(inv && inv.length>0){
          inv=rep.reverse()
          if(add)this.idCurrentInv=inv[0].id
        }
        this.inventaires=inv
        this.show=true
      },
      error=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  addNew(){
    this.showForm=true
    this.idPresiComite=0
    this.instructions=[]
    this.docsPv=[]
    this.docsDc=[]
    this.tabComite=new FormArray([]);
    this.tabPresents=new FormArray([]);
    this.tabOtherPresent=new FormArray([]);
    this.tabLoc=[];
    this.tabDeliberation=new FormArray([]);
    this.pvCreer=false
    this.invCreer=false
    this.signatairesPv=[]
    this.signatairesInst=[]
    this.tabOpen=[]
    this.subdivisions?.forEach(sub=>this.tabOpen.push(0))
    this.initForm()
  }
  updateOne(inventaire){
    this.showForm=true
    this.idPresiComite=inventaire.presiComite?.id
    this.instructions=inventaire.instruction
    this.docsPv=inventaire.pvReunion
    this.docsDc=inventaire.decisionCC

    this.tabComite=new FormArray([]);
    inventaire.membresCom.forEach(membre => this.addComMembre(membre.id));
    if(this.tabComite.length==0)this.addComMembre()

    this.tabPresents=new FormArray([]);
    inventaire.presentsReunion.forEach(membre => this.addPresentMembre(membre.id));
    if(this.tabPresents.length==0)this.addPresentMembre()

    this.tabOtherPresent=new FormArray([]);
    inventaire.presentsReunionOut.forEach(nom => this.addOtherPres(nom));
    if(this.tabOtherPresent.length==0)this.addOtherPres()

    this.tabLoc=[]
    inventaire.localites.forEach(loc=>this.checkLoc(this.getOneLocById(loc.id)));//this.getOneLocById a cause de la serialisation
    this.invCreer=false
    if(inventaire.localInstructionPv[0]=='creation'){
      this.invCreer=true
      this.initInstrucForm(inventaire.instruction)
    }
    this.pvCreer=false
    if(inventaire.localInstructionPv[1]=='creation'){
      this.pvCreer=true
      let data=inventaire.pvReunion
      this.tabDeliberation=new FormArray([]);
      data[1].forEach(del => this.addDeliberation(del[0],del[1]));
      this.initPvForm([
        data[0][0], data[0][1], data[0][2],
        data[0][3]?data[0][3]:[]
      ])
      if(this.tabDeliberation.length==0)this.addDeliberation()
    }
    this.initForm(inventaire)
  }
  initForm(data={id:0,dateInv:new Date().getFullYear()+'-12-31T00:00:00+00:00',debut:'',fin:'',lieuReunion:'',dateReunion:''}){
    this.editForm = this.fb.group({
      id: [data.id],
      dateInv: [data.dateInv],
      debut: [data.debut],
      fin: [data.fin],
      lieuReunion: [data.lieuReunion],
      dateReunion: [data.dateReunion]
    },
    {
      validator: this.valideDif('debut', 'fin')
    });
    if(this.formDirective)this.formDirective.resetForm()
  }
  initInstrucForm(data=[["","",""],["","",""],["","","",""],[]]){
    this.instForm = this.fb.group({
      bloc1e1: [data[0][0]],
      bloc1e2: [data[0][1]],
      bloc1e3: [data[0][2]],

      bloc2e1: [data[1][0]],
      bloc2e2: [data[1][1]],
      bloc2e3: [data[1][2]],

      bloc3e1: [data[2][0]],
      bloc3e2: [data[2][1]],
      bloc3e3: [data[2][2]],
      bloc3e4: [data[2][3]],
    })
    this.signatairesInst=data[3]?data[3]:[]
  }
  detailsLoc(inventaire){
    this.tabLoc=[];
    this.tabOpen==[];
    inventaire.localites.forEach(localite => this.tabLoc.push(this.getOneLocById(localite.id)));//this.getOneLocById car serialisation fait que l objet n est pas complet
    this.subdivisions?.forEach(sub=>this.tabOpen.push(0))
  }
  initPvForm(data=["","","",[]]){
    this.pvForm = this.fb.group({
      bloc1: [data[0]],
      bloc2: [data[1]],
      bloc3: [data[2]]
    })
    this.signatairesPv=this.getSignatairePv(data[3])
  }
  getSignatairePv(data){
    if(data?.length>0)return data
    return []
  }
  getInstValDef(){
    return[
      [
        "La réunion de lancement de l'inventaire sera tenue le 20/12. Les points suivants seront abordés:\n - la composition des équipes;\n  - la méthode de comptage…",
        "ACQUISITIONS\nPour l'acquisition d'immobilisations, une demande d'achat initiée par le service demandeur. Cette demande est validée par le Chef comptable. Ensuite, un Bon de Commande est établi et sera signé par le DAF et le DG. Après réception de l'immobilisation, un code barre est généré et apposé sur l'immobilisation.\n\nCESSIONS\nToutes les sorties doivent faire l'objet d'un bon validé par le Chef du magasin, le DAF et le DG.",
        "Il faudra:\n - Editer le fichier des immobilisations\n - Faire une revue des postes  \n - Procéder aux régularisations nécessaires devant permettre de s'assurer de l'exactitude des mouvements de l'année",
      ],
      [
        "Le Comité d'inventaire est mis en place sera composé de:\n- M. Pathé Ndiaye (Président);\n- Mme Isabelle Diouf (membre);\n- M. Saliou Ba (membre)\n\nIl devra:\n  - mettre en place toute la logistique nécessaire pour le démarrage effectif de l'inventaire physique à la date prévue ( constitution et formation des équipes, matériel nécessaire etc..);\n  - prendre toutes les dispositions pour l'organisation et la supervision de l'inventaire;\n  - valider les résultats de l'inventaire et élaborer un rapport d'inventaire.",
        "1. MAGASIN\nLe rangement des magasins avec vérification des CODES se fera effectué avant le 09/10. Le magasin est composé de 2 dépôts.\n1.1. Dépôt 01\nLe dépôt 01 sera divisé en 02 sous-zones de stockage :\n    - Sous-zone A : salle 1 et 2 (Equipe A)\n    - Sous-zone B : Cour extérieure (Equipe A).\n1.2. Dépôt 02 \nLe dépôt 02 sera divisé en 02 Sous-zones de stockage :\n - Sous-zone A : Showroom (Equipe B)\n    - Sous-zone B : salle des pièces de rechange (Equipe B)\n\n2. ENTREPOT\nLe comptage sera effectué par l'équipe C.",
        "ORGANISATION\nLe rangement des magasins sera effectué à partir du Mercredi 09/12.\nIl faudra s’assurer que les étiquettes à code barre ont été apposées sur toutes les immobilisations.\n\nCOMPTAGE\nLe fichier des immobilisations sera remis à chaque équipe. Des étiquettes (gommettes) de couleur bleue et un lecteur de codes seront aussi transmis à chaque chef d’équipe. \n\nCONTROLE\nAprès le comptage, une autre équipe  passe pour le contrôle en utilisant des étiquettes (gommettes) de couleur verte.\n\nANOMALIES\nEn cas de désaccord entre l’équipe de comptage et de contrôle, un comptage contradictoire sera piloté par le comité d’inventaire (Etiquettes de couleur rouge)."
      ],
      [
        "Cette phase consistera à effectuer un rapprochement entre le fichier des immobilisations et les résultats de l'inventaire et afin d'identifier:\n  - les immobilisations inscrites au fichier mais non inventoriées (manquants d'inventaire);\n  - et les immobilisations inventoriées mais non inscrites au fichier (sans numéro d'immatriculation et/ou sans étiquettes).\n\nLes écarts constatés doivent faire l'objet de recherches complémentaires, par les équipes de comptage, en vue de leur résorption. S'agissant des articles recensés au cours de cet inventaire, mais non inscrits au fichier des immobilisations, il conviendra de les répertorier sur un tableau séparé. En outre, des dispositions devront être prises pour veiller à leur immatriculation diligente au fichier des immoblisations.",
        "Les anomalies retracées devront être analysées et corrigées, au plus le 15 janvier.",
        "L'inventaire sera appouvé par le comité d'inventaire.",
        "Le dossier à constituer devra comporter les documents ci-après:\n- un procès-verbal d'inventaire;\n- les annexes avant et après corrections"
      ]
    ]
  }
  getPvValDef(){
    return  [
      "L’AN DEUX MILLE VINGT \nET LE 09 JUILLET A 08 HEURES 10 MINUTES",
      "La réunion de lancement de l'inventaire a été tenue au siège social sis à l'avenue Bourgui pour délibérer sur l’ordre du jour suivant :  \n1.	Instructions d'inventaire\n2.	Planning de l'inventaire\n3.	Questions diverses.",
      "Une feuille de présence a été émargée en début de séance par chaque participant. \nEtaient présent : \n-	M. Pathé Ndiaye (Président du comité),…",
      "Les instructions d'inventaire ont été transmises à tous les intervenants. Ces derniers ont attesté avoir pris connaissance de celles-ci."
    ]
  }
  getCommentInst(){
    return[
      [
        "Commentaire :\n - Indiquer la date de réunion\n - Préciser les points qui seront traités lors de la réunion\n-  S'assurer de la disponibilité du planning des inventaires",
        "Commentaire :\n - Rappeler la procédure d'acquisition des immobilisations\n - Rappeler la procédure de sorties des immobilisations",
        "Commentaire :\n - Décrire les différentes étapes liées à l'édition et au contrôle du fichier des immoblisations\n - Identifier les intervenants"
      ],
      [
        "Commentaire :\n -Indiquer les missions du comité\n -lister les membres du comité",
        "Commentaire :\n -Lister zones à inventorier et les équipes affectées à chaque zone",
        "Commentaire :\n - Lister les biens à inventorier\n - Décrire la procédure de comptage\n- Décrire la procédure de controle"
      ],
      [
        "Commentaire :\n - Décrire la prodédure de rapprochement",
        "Commentaire :\nDécrire la procédure de correction des anomalies",
        "Commentaire :\nIndiquer la procédure d'approbation de l'inventaire",
        "Commentaire :\nIndiquer les composants du dossier d'inventaire"
      ]
    ]
  }
  getCommentPv(){
    return  [
      "Commentaire :\nMettre la date et l'heure",
      "Commentaire :\nindiquer les points à l'ordre du jour",
      "Commentaire :\nLister les personnes présentes à la réunion"
    ]
  }
  getCommentDel(i){
    let mot='eme'
    if(i==0)mot='er'
    i++ // car commence par 0
    return "Commentaire :\n"+i+mot+" point à l'ordre du jour"
  }
  addDeliberation(titre='DÉLIBERATION '+(this.tabDeliberation.length+1)+" :",content='') {
    this.tabDeliberation.push(
      new FormGroup({
        titre:new FormControl(titre),
        content:new FormControl(content)
      })
    );
  }
  valideDif(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.diffDate) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (new Date(control.value)>new Date(matchingControl.value)) {
            setTimeout(()=>matchingControl.setErrors({ diffDate: true }),1)//pour eviter l erreur: Expression has changed after it was checked
        } else {
            matchingControl.setErrors(null);
        }
    }
  }
  getUsers(users){
    users=users.filter(u=>u.status=="actif")
    this.presidents=users.filter(u=>u.roles && u.roles[0]=="ROLE_PC")
    this.membresComite=users.filter(u=>u.roles && u.roles[0]=="ROLE_MC")
    this.users=users//.filter(u=>u.id!=this.myId) ne pas mettre sinon si present il n y sera ps
  }
  getUserById(id){
    return this.users.find(u=>u.id==id)
  }
  onEditSave(form: FormGroup){
    this.securityServ.showLoadingIndicatior.next(true)
    let data=this.getAllDataToSend(form)
    this.inventaireServ.addInventaire(data).then(
      rep=>{
        //this.securityServ.showLoadingIndicatior.next(false) gerer par getInventaire
        this.showNotification('bg-success',rep.message,'top','center')
        let add=data.id==0?true:false
        this.getInventaireByEse(add)
        this.showForm=false
      },message=>{
        console.log(message)
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-red',message,'top','right')
      }
    )
  }
  getAllDataToSend(form: FormGroup){
    let data=this.getData(form.value)
    data.instructions=this.getOnlyFile(this.instructions)
    data.instrucCreer=this.getDataInstCreer()
    data.decisionCC=this.getOnlyFile(this.docsDc)
    data.presiComite=this.idPresiComite
    data.membresCom=this.tabComite.value
    data.presentsReunion=this.tabPresents.value
    data.presentsReunionOut=this.tabOtherPresent.value
    data.pvReunion=this.getOnlyFile(this.docsPv)
    data.pvReunionCreer=this.getDataPvCreer()
    data.entreprise=this.idCurrentEse
    data.localites=this.getOneLyId(this.tabLoc)
    data.localInstructionPv=[this.invCreer?'creation':'download',this.pvCreer?'creation':'download']
    console.log(data)
    return data
  }
  getOneLyId(localites){
    let l=[]
    localites.forEach(loc => l.push(loc.id));
    return l
  }
  getDataInstCreer(){
    let d=this.instForm.value
    d.signataire=this.signatairesInst//on y ajoute les signataires
    return d
  }
  getDataPvCreer(){
    let val=this.pvForm.value
    const data1=[val.bloc1,val.bloc2,val.bloc3,this.signatairesPv]
    let data2=[]
    this.tabDeliberation.value.forEach(del => {
      let titre=del.titre.trim()
      let content=del.content.trim()
      if(titre!='' || content!=''){
        data2.push({titre:titre,content:content})
      }
    });
    return [data1,data2]
  }
  getOnlyFile(tab){
    let t=[]
    tab.forEach(element => t.push(element[1]));//0 c est le nom
    return t
  }
  handleFileInput(files:FileList){
    for(let i=0;i<files.length;i++){
      this.instructions.push([files.item(i).name,files.item(i)]);
    }
  }
  handleFileInputPv(files:FileList){
    for(let i=0;i<files.length;i++){
      this.docsPv.push([files.item(i).name,files.item(i)]);
    }
  }
  handleFileInputDc(files:FileList){
    for(let i=0;i<files.length;i++){
      this.docsDc.push([files.item(i).name,files.item(i)]);
    }
  }
  addComMembre(valeur=0){
    this.tabComite.push(new FormControl(valeur));
  }
  addPresentMembre(valeur=0){
    this.tabPresents.push(new FormControl(valeur));
  }
  addOtherPres(nom=""){
    this.tabOtherPresent.push(new FormControl(nom))
  }
  closeComite(){
    this.closeComiteModal.nativeElement.click();
  }
  closePresent(){
    this.closePresentModal.nativeElement.click();
  }
  closeLoc(){
    this.closeLocaliteModal.nativeElement.click();
  }
  noNull(tab){
    let t=[]
    tab.forEach(element => {
      if(element)t.push(element)
    });
    return t
  }
  openComModal(){
    if(this.tabComite.length==0)this.addComMembre()
  }
  openPresModal(){
    if(this.tabPresents.length==0)this.addPresentMembre(parseInt(this.myId))
    if(this.tabOtherPresent.length==0)this.addOtherPres()
  }
  openLocModal(){
  }
  inTab(valeur,tab){
    return tab.find(id=>id==valeur);
  }
  deleteInst(index){
    this.instructions.splice(index, 1)
  }
  deletePv(index){
    this.docsPv.splice(index, 1)
  }
  deleteDc(index){
    this.docsDc.splice(index, 1)
  }
  getData(data){
    if(data.dateInv){
      data.dateInv=this.formattedDate(data.dateInv)
    }
    if(data.debut){
      data.debut=this.formattedDate(data.debut)
    }
    if(data.fin){
      data.fin=this.formattedDate(data.fin)
    }
    if(data.dateReunion){
      data.dateReunion=this.formattedDate(data.dateReunion)
    }
    return data
  }
  formattedDate(d = new Date) {
    d=new Date(d)
    return [d.getFullYear(), d.getMonth()+1, d.getDate()].map(n => n < 10 ? `0${n}` : `${n}`).join('-');
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['bg-red']
    });
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this._snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: [colorName,'color-white']
    });
  }
  rev(tab,rev=-1){
    let t=[]
    if(tab && tab.length>0){
      t=tab
      t=this.sharedService.uniq(t,'id')
      this.sharedService.trier(t,'id',rev)
    }
    return t
  }
  deletCreationInst(){
    this.invCreer=false
    this.instructions=[]
    this.initInstrucForm()
  }
  deletCreationPv(){
    this.pvCreer=false
    this.docsPv=[]
    this.initPvForm()
    this.tabDeliberation=new FormArray([]);
  }
  createNewInv(){
    this.invCreer=true
    const valInstruction=this.getInstValDef()
    this.initInstrucForm(valInstruction)
  }
  createNewPv(){
    this.pvCreer=true
    this.tabDeliberation=new FormArray([]);
    const valPv=this.getPvValDef()
    this.initPvForm([valPv[0],valPv[1],valPv[2],[]])
    this.tabDeliberation=new FormArray([]);
    const content="Les instructions d'inventaire ont été transmises à tous les intervenants. Ces derniers ont attesté avoir pris connaissance de celles-ci."
    const title="DÉLIBERATION 1: INSTRUCTIONS D'INVENTAIRE"
    this.addDeliberation(title,content)
  }
  generatePdf(data,numero) {
    let content=[]
    if(numero==0)
      content=[this.pageInst(data)]
    else if(numero==1)
      content=[this.pagePv(data)]
    const documentDefinition = {
      content: content, styles: this.getStyle(),pageMargins: [40, 40]
    };
    // pdfMake.createPdf(documentDefinition).getBase64((encodedString)=> {
    //   const v='data:application/pdf;base64, '+encodedString;
    //   if(numero==0)
    //     this.urlInst=v
    //   else if(numero==1)
    //     this.urlPv=v
    //   console.log(this.urlInst);
    // });
    pdfMake.createPdf(documentDefinition).open();
  }
  getStyle() {
    return {
      fsize: {
        fontSize: 6.5,
      },
      enTete:{
        fontSize: 6.5,
        fillColor: '#eeeeee',
      },
      enTete2:{
        fontSize: 6.5,
        bold: true,
        fillColor: '#bcbdbc',
      },
      gris:{
        fillColor: '#bcbdbc'
      },
      grasGris:{
        bold: true,
        fillColor: '#e6e6e6'
      },
      grasGrisF:{
        bold: true,
        fillColor: '#b5b3b3'
      },
      gras:{
        bold: true
      },
      centerGG:{
        bold: true,
        fillColor: '#e6e6e6',
        alignment:'center'
      },
      no_border:{
        border:false
      }
    }
  }
  pageInst(data){
      const bloc1e1 = data[0][0]
      const bloc1e2 = data[0][1]
      const bloc1e3 = data[0][2]

      const bloc2e1 = data[1][0]
      const bloc2e2 = data[1][1]
      const bloc2e3 = data[1][2]

      const bloc3e1 = data[2][0]
      const bloc3e2 = data[2][1]
      const bloc3e3 = data[2][2]
      const bloc3e4 = data[2][3]
      const signataires= [3]?data[3]:[]
      console.log(signataires);
      
      return[
        ...this.getImage(),
        {
          table:{
            width:['*'],
            body:[
              ...this.getEntete(),
              [
                {text:'',margin:[2,7],border:[false,false,false,false]}
              ],
              [
                {text:"INSTRUCTIONS D'INVENTAIRE", style:'grasGris',alignment:'center'}
              ],
              [
                {text:'',margin:[2,7],border:[false,false,false,false]}
              ],
              [
                {text:'1.TRAVAUX PREPARATOIRES', style:'grasGrisF',alignment:'center',fontSize:12}
              ],
              [
                {text:"1.1. REUNION DE LANCEMENT DE L'INVENTAIRE", style:'grasGris',alignment:'center'}
              ],
              [
                {text:bloc1e1,margin:[2,7],fontSize:10}
              ],
              [
                {text:'1.2. RAPPEL DE LA PROCEDURES SUR LES IMMOBILISATIONS', style:'grasGris',alignment:'center'}
              ],
              [
                {text:bloc1e2,margin:[2,7],fontSize:10}
              ],
              [
                {text:'1.3. EDITION ET CONTRÔLE DU FICHIER DES IMMOBILISATIONS', style:'grasGris',alignment:'center'}
              ],
              [
                {text:bloc1e3,margin:[2,7],fontSize:10}
              ],
              [
                {text:"2.TRAVAUX D'INVENTAIRE", style:'grasGrisF',alignment:'center'}
              ],
              [
                {text:"2.1. MISE EN PLACE DU COMITE D'INVENTAIRE", style:'grasGris',alignment:'center'}
              ],
              [
                {text:bloc2e1,margin:[2,7],fontSize:10}
              ],
              [
                {text:"2.2. AFFECTATION DES EQUIPES D'INVENTAIRE", style:'grasGris',alignment:'center'}
              ],
              [
                {text:bloc2e2,margin:[2,7],fontSize:10}
              ],
              [
                {text:"2.3. DEROULEMENT DE L'INVENTAIRE", style:'grasGris',alignment:'center'}
              ],
              [
                {text:bloc2e3,margin:[2,7],fontSize:10}
              ],
              [
                {text:"3.TRAVAUX POST-INVENTAIRE", style:'grasGrisF',alignment:'center'}
              ],
              [
                {text:"3.1. RAPPROCHEMENT FICHIER D'IMMOBILISATIONS ET RESULTATS DE L'INVENTAIRE", style:'grasGris',alignment:'center'}
              ],
              [
                {text:bloc3e1,margin:[2,7],fontSize:10}
              ],
              [
                {text:"3.2. CORRECTION DES ANOMALIES", style:'grasGris',alignment:'center'}
              ],
              [
                {text:bloc3e2,margin:[2,7],fontSize:10}
              ],
              [
                {text:"3.3. APPROBATION D'INVENTAIRE", style:'grasGris',alignment:'center'}
              ],
              [
                {text:bloc3e3,margin:[2,7],fontSize:10}
              ],
              [
                {text:"3.4. TRANSMISSION DU DOSSIER D'INVENTAIRE", style:'grasGris',alignment:'center'}
              ],
              [
                {text:bloc3e4,margin:[2,7],fontSize:10}
              ]
            ]
          },margin:[0,10,0,0]
        },
        ...this.getSignatairePdf(signataires)
      ]
  }
  pagePv(data){
      const bloc1 = data[0][0]
      const bloc2 = data[0][1]
      const bloc3 = data[0][2]
      const signataires= data[0][3]?data[0][3]:[]
      return[
        ...this.getImage(),
        {
          table:{
            width:["*"],
            body:[
              ...this.getEntete(),
              [
                {text:'',margin:[2,7],border:[false,false,false,false]}
              ],
              [
                {text:"PROCES-VERBAL DE REUNION DE LANCEMENT DE L'INVENTAIRE", style:'grasGris',alignment:'center'}
              ],
              [
                {text:'',margin:[2,7],border:[false,false,false,false]}
              ],
              [
                {text:bloc1+"\n\n"+bloc2+"\n\n"+bloc3,margin:[2,7],fontSize:10}
              ],
              ...this.getPdfDel(data[1])
            ]
          },margin:[0,10,0,0]
        },
        ...this.getSignatairePdf(signataires)
      ]
  }
  getImage(){
    if(this.entreprise.image && this.entreprise.image!=IMAGE64)return [{image: this.entreprise.image ,width: 75}]
    return [{}]
  }
  getEntete(){
    const e=this.entreprise
    let k=e.capital?this.sharedService.numStr(e.capital,' ')+" de FCFA":""
    return[
      [
        {text:"Dénomination : "+e.denomination,border:[false,false,false,false],margin:[-5,0,0,0]}
      ],
      [
        {text:"Capital : "+k,border:[false,false,false,false],margin:[-5,0,0,0]}
      ],
      [
        {text:"Pays : "+e.republique,border:[false,false,false,false],margin:[-5,0,0,0]}
      ]
    ]
  }
  getPdfDel(table){
    let element: any = []
    table.forEach(cel => {
      if(cel[0]?.trim()!="" && cel[1]?.trim()!="")
        element.push(
        [
          {text:cel[0],fontSize:12,style:'grasGris',alignment:'center'},
        ],
        [
          {text:cel[1],fontSize:10,margin:[2,7]},
        ])
    })
    return element
  }
  getSignatairePdf(signataires){
    if(!signataires || signataires.length==0)return [{}]
    if(signataires.length==1)return this.getOneSignatairePdf(signataires)
    if(signataires.length==3)return this.get3SignatairePdf(signataires)//modif
    return this.getOtherSignatairePdf(signataires)
  }
  getOneSignatairePdf(signataires){
    return [{text:signataires[0],margin:[0,20,0,0],fontSize:10,decoration: 'underline'}]
  }
  get3SignatairePdf(signataires){
    return [
      {
        table:{
          widths:["*","*"],
          body:[
            [
              {text:signataires[0], fontSize:10, margin:[0,20,0,0], decoration: 'underline', border:[false,false,false,false]},
              {text:signataires[2], fontSize:10, margin:[0,20,0,0], decoration: 'underline', border:[false,false,false,false], alignment:'right'}
            ],
            [
              {text:signataires[1], fontSize:10, margin:[0,0,0,0], decoration: 'underline', border:[false,false,false,false], alignment:'center',colSpan: 2},{}
            ]
          ]
        }
      }
    ]
  }
  getOtherSignatairePdf(signataires){
    return [
      {
        table:{
          widths:["*","*"],
          body:[
            ...this.lignesSignataires(signataires)
          ]
        }
      }
    ]
  }
  lignesSignataires(signataires){
    let tab=[]
    let a=0
    for(let i=0;i<signataires.length;i+=2){
      let nom1=signataires[i]
      let nom2=signataires[i+1]?signataires[i+1]:""
      tab.push(
        [
          {text:nom1,fontSize:10,margin:[0,20,0,70],decoration: 'underline',border:[false,false,false,false]},
          {text:nom2,fontSize:10,margin:[0,20,0,70],decoration: 'underline',alignment:'right',border:[false,false,false,false]}
        ]
      )
    }
    return tab
  }
  overLoc(localite){// au cas ou tu veux faire des traitement au hover d une localite
    console.log(localite)
    this.locHover=localite
  }
  overZone(zone){
    console.log(zone)
    this.zoneHover=zone
  }
  overSz(sz){
    console.log(sz)
    this.szHover=sz
  }
  outHoverLZS(){
    this.locHover=null
    this.zoneHover=null
    this.szHover=null
  }
  longText(text,limit){
    return this.sharedService.longText(text,limit)
  }
  addSignPv(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.signatairesPv.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.signPvCtrl.setValue(null);
  }
  removeSignPv(fruit: string): void {
    const index = this.signatairesPv.indexOf(fruit);

    if (index >= 0) {
      this.signatairesPv.splice(index, 1);
    }
  }
  addSignInst(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.signatairesInst.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.signInstCtrl.setValue(null);
  }
  removeSignInst(fruit: string): void {
    const index = this.signatairesInst.indexOf(fruit);

    if (index >= 0) {
      this.signatairesInst.splice(index, 1);
    }
  }
  firstSub(localites){
    return localites?.filter(loc=>loc.position?.length>0)
  }
  checkLoc(loc){
    var index = this.tabLoc.indexOf(loc);
    if (index > -1) {
      this.tabLoc.splice(index, 1);
    }else{
      this.tabLoc.push(loc)
      const idParent=loc.idParent
      if(idParent && !this.isChecked(idParent)) this.checkLoc(this.getOneLocById(idParent))//cocher les parents recursif
    }
  }
  checkAllLoc(){
    const allIsCheck=this.allLocIsChec()
    if(allIsCheck){
      this.tabLoc=[]
      return
    }
    this.localites.forEach(localite=>{
      if(!this.isChecked(localite.id))this.checkLoc(localite)
    })
  }
  allLocIsChec(){
    let bool=true
    this.localites.forEach(localite=>{
      if(bool)bool=this.isChecked(localite.id)
    })
    return bool
  }
  openFirst(id){
    this.openLocalite=id
    this.tabOpen[0]=id
    this.offUnderSub(1)
  }
  getOneLocById(id){
    let l= this.localites?.find(loc=>loc.id==id)
    return l?l:null
  }
  getCurrentSubById(id){
    let l= this.getOneLocById(id)?.subdivisions
    return l?l:[]
  }
  openOther(i,id){
    this.tabOpen[i]=id
    this.offUnderSub(i+1)//les surdivisions en dessous
  }
  offUnderSub(j){
    for(let i=j;i<this.tabOpen.length;i++){
      if(this.tabOpen[i])this.tabOpen[i]=0
    }
  }
  isChecked(id){
    return this.tabLoc.find(loc=>loc.id==id)
  }
} 

