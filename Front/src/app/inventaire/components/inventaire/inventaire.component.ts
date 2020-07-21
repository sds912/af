import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder, FormControl, Validators,NgForm, FormArray } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdminService } from '../../../administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { InventaireService } from '../../service/inventaire.service';
import { Entreprise } from 'src/app/administration/model/entreprise';

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
  tabZonesPick=[]
  tabSousZPick=[]
  addLoc=true
  addZone=true
  comments=[]
  commentsPv=[]
  invCreer=false
  pvCreer=false
  tabDeliberation=new FormArray([]);
  constructor(private fb: FormBuilder, 
              private _snackBar: MatSnackBar,
              private adminServ:AdminService,
              private sharedService:SharedService,
              private securityServ:SecurityService,
              private inventaireServ:InventaireService) {
    
    this.imgLink=this.sharedService.baseUrl +"/images/"
    this.docLink=this.sharedService.baseUrl +"/documents/"
  }
  
  ngOnInit() {
    this.myId=localStorage.getItem('idUser')
    this.securityServ.showLoadingIndicatior.next(true)
    this.initForm()
    this.initInstrucForm()
    this.comments=this.getCommentInst()
    this.initPvForm()
    this.commentsPv=this.getCommentPv()
    this.getInventaire()
    this.getEntreprise()
  }
  getEntreprise(){
    this.adminServ.getEntreprise().then(
      rep=>{
        let e=rep
        if(e && e.length>0){
          e=rep.reverse()
          this.idCurrentEse=e[0].id
          this.localites=rep[0].localites
          this.getUsers(rep[0].users)
        }
        console.log(rep);
        
        this.entreprises=e
        this.securityServ.showLoadingIndicatior.next(false)
      },
      error=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  entiteChange(id){
    this.idCurrentInv=0
    this.showForm=false
    let entreprise=this.entreprises.find(e=>e.id==id)
    if(entreprise){
      this.localites=entreprise.localites
      this.getUsers(entreprise.users)
    }
  }
  forOnLyEntity(tab){
    const invemtaires=tab?.filter(inv=>inv.entreprise.id==this.idCurrentEse)
    if(invemtaires)return invemtaires
    return []
  }
  getInventaire(){
    this.inventaireServ.getInventaire().then(
      rep=>{
        console.log(rep)
        this.securityServ.showLoadingIndicatior.next(false)
        let inv=rep
        if(inv && inv.length>0){
          inv=rep.reverse()
          //if(this.idCurrentInv==0)this.idCurrentInv=inv[0].id
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
    this.tabZonesPick=[];
    this.tabSousZPick=[];
    this.tabDeliberation=new FormArray([]);
    this.pvCreer=false
    this.invCreer=false
    this.initForm()
  }
  updateOne(inventaire){
    this.showForm=true
    this.idPresiComite=inventaire.presiComite.id
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

    this.tabLoc=[];
    this.tabZonesPick=[];
    this.tabSousZPick=[];
    inventaire.localites.forEach(localite => this.tabLoc.push(localite));
    inventaire.zones.forEach(zone => this.tabZonesPick.push(zone.id));
    inventaire.sousZones.forEach(sousZone => this.tabSousZPick.push(sousZone.id));
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
      this.initPvForm([data[0][0],data[0][1],data[0][2]])
      if(this.tabDeliberation.length==0)this.addDeliberation()
    }
    this.initForm(inventaire)
  }
  initForm(data={id:0,debut:'',fin:'',lieuReunion:'',dateReunion:''}){
    this.editForm = this.fb.group({
      id: [data.id],
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
  initInstrucForm(data=[["","",""],["","",""],["","","",""]]){
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
  }

  initPvForm(data=["","",""]){
    this.pvForm = this.fb.group({
      bloc1: [data[0]],
      bloc2: [data[1]],
      bloc3: [data[2]]
    })
  }
  getInstValDef(){
    return[
      [
        "La réunion de lancement de l'inventaire sear tenu le 20/12. Les points suivants seront abordés:\n - la composition des équipes;\n - la méthode de comptage…",
        "ACQUISITIONS\nL'acquisition d'immobilisations commence par une demande d'achat initiée par le demandeur. Cette demande est validée par le Chef comptable. Ensuite un BC est établi et sera signé par le DAF et le DG. Après réception de l'immobilisation, un code barre est généré et apposé sur l'immobilisation.\n\nCESSIONS\nToutes les sorties doivent faire l'objet d'un bon validé par le Chef du magasin, le DAF et le DG.",
        "Il faudra:\n - Editer le fichier des immobilisations\n - Faire une revue des postes \n - Procéder aux régularisations nécessaires devant permettre de s'assurer de l'exactitude des mouvements de l'année",
      ],
      [
        "Le Comité d'inventaire est mis en place sera composé de:\n- M. Pathé Ndiaye (Président);\n- Mme Isabelle Diouf ( membre);\n- M. Saliou Ba ( membre)\n\nIl devra:\n  - mettre en place toute la logistique nécessaire pour le démarrage effectif de l'inventaire physique à la \ndate prévue ( constitution et formation des équipes, matériel nécessaire etc..);\n  - prendre toutes les dispositions pour l'organisation et la supervision de l'inventaire;\n  - valider les résultats de l'inventaire et élaborer un rapport d'inventaire.",
        "1. MAGASIN\nLe rangement des magasins avec vérification des CODES se fera effectué avant le 09/10. Le magasin est composé de 2 dépôts.\n1.1. Dépôt 01\nLe dépôt 01 sera divisé en 02 sous-zones de stockage:\n    - Sous-zone A : salle 1 et 2 (Equipe A)\n    - Sous-zone B : Cour extérieure (Equipe A).\n1.2. Dépôt 02 \nLe dépôt 02 sera divisé en 02 Sous-zones de stockage:\n   - Sous-zone A : Showroom (Equipe B)\n    - Sous-zone B : salle des pièces de rechange (Equipe B)\n\n2. ENTREPOT\nLe rangement de l'entrepot avec vérification des CODES se fera effectué avant le 09/10. Le comptage sera effectué par l'équipe C.",
        "ORGANISATION\nLe rangement des magasins sera effectué à partir du Mercredi 09/12.\nIl faudra s’assurer que les étiquettes à code barre ont été apposés sur toutes les immobilisations.\n\nCOMPTAGE\nLe fichier des immobilisations sera remis à chaque équipe. Des étiquettes (gommettes) de couleur bleue et un lecteur de codes seront aussi transmis à chaque chef d’étiquette. \n\nCONTROLE\nAprès le comptage, une autre équipe de passe pour le contrôle en utilisant des étiquettes (gommettes) de couleur verte.\n\nANOMALIES\nEn cas de désaccord entre l’équipe de comptage et de contrôle, un comptage contradictoire sera piloté par le comité d’inventaire (Etiquettes de couleur rouge)."
      ],
      [
        "Cette phase consistera à effectuer un rapprochement entre les résultats de l'inventaire et le fichier des immobilisations afin d'identifier:\n  - les immobilisations inscrites au fichier mais non inventoriées (manquants d'inventaire);\n  - et les immobilisations inventoriées mais non inscrites au fichier (sans numéro d'immatriculation et/ou sans étiquettes).\n\nLes écarts constatés doivent faire l'objet de recherches complémentaires, par les équipes de comptage, en vue de leur résorption. S'agissant des articles recensés au cours de cet inventaire, mais non inscrits au fichier des immobilisations, il conviendra de les répertorier sur un tableau séparé. En outre, des dispositions devront être prises pour veiller à leur immatriculation diligente au fichier des immoblisations.",
        "Les anomalies retracées devront être analysées et corrigées, au plus le 15 janvier.",
        "L'inventaire sera appouvé par le comité d'inventaire.",
        "Le dossier à constituer devra comporter les documents ci-après:\n- un procès-verbal d'inventaire;\n- les annexes avant et après corrections "
      ]
    ]
  }
  getPvValDef(){
    return  [
      "L’AN DEUX MILLE VINGT \nET LE 09 JUILLET A 08 H EURES 10 MINUTES",
      "La réunion de lancement de l'inventaire a été tenue au siège social sis à l'avenue Bourgui pour délibérer sur l’ordre du jour suivant : \n1.	Instructions d'inventaire\n2.	planning de l'inventaire\n3.	Questions diverses.",
      "Une feuille de présence a été émargée en début de séance par chaque administrateur. \nEtaient présent : \n-	M. Pathé Ndiaye (Président du comité),…",
      "Les instructions d'inventaire ont été transmises à tous les intervenants. Ces derniers ont attesté avoir pris connaissance de celles-ci."
    ]
  }
  getCommentInst(){
    return[
      [
        "Commentaire :\n - Indiquer la date de réunion\n - Préciser les points qui seront traitées lors de la réunion\n-  Assurer la disponibilité du planning des inventaires",
        "Commentaire :\n - Rappeler la procédure d'acquisition des immobilisations\n - Rappeler la procédure de sorties des immobilisations",
        "Commentaire :\n - Décrire les différentes étapes liées à l'édition et au contrôle du fichier des immoblisations\n - Identifier les intervenants"
      ],
      [
        "Commentaire :\n -Indiquer le role du comité\n -lister les membres du comité",
        "Commentaire :\n -Lister zones à inventorier et les équpes affectées à chaque zone",
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
  addDeliberation(titre='',content='') {
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
  getLocById(id){
    return this.localites.find(u=>u.id==id)
  }
  onEditSave(form: FormGroup){
    this.securityServ.showLoadingIndicatior.next(true)
    let data=this.getData(form.value)
    data.instructions=this.getOnlyFile(this.instructions)
    data.instrucCreer=this.instForm.value
    data.decisionCC=this.getOnlyFile(this.docsDc)
    data.presiComite=this.idPresiComite
    data.membresCom=this.tabComite.value
    data.presentsReunion=this.tabPresents.value
    data.presentsReunionOut=this.tabOtherPresent.value
    data.pvReunion=this.getOnlyFile(this.docsPv)
    data.pvReunionCreer=this.getDataPvCreer()
    data.entreprise=this.idCurrentEse
    data.localites=this.getIdAllLoc(this.tabLoc)
    data.zones=this.tabZonesPick
    data.sousZones=this.tabSousZPick
    data.localInstructionPv=[this.invCreer?'creation':'download',this.pvCreer?'creation':'download']
    console.log(data)
    this.inventaireServ.addInventaire(data).then(
      rep=>{
        console.log(rep)
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-success',rep.message,'top','center')
        this.getInventaire()
        this.showForm=false
      },message=>{
        console.log(message)
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-red',message,'top','right')
      }
    )
  }
  getDataPvCreer(){
    let val=this.pvForm.value
    const data1=[val.bloc1,val.bloc2,val.bloc3]
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
  getIdAllLoc(localites){
    let t=[]
    localites.forEach(loc => t.push(loc.id));
    return t
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

  deleteLoc(localite,i){
    let index=this.tabLoc.indexOf(localite)
    if (index > -1) {
      this.tabLoc.splice(index, 1);
      const zones=localite.zones
      if(zones) zones.forEach(zone => { this.deleteZone(zone) });//supp les zones
    }
  }
  deleteZone(zone){
    let index=this.tabZonesPick.indexOf(zone.id)
    if (index > -1) {
      this.tabZonesPick.splice(index, 1);
      const sousZones=zone.sousZones
      if(sousZones) sousZones.forEach(sz => { this.deletSZ(sz.id) });//supp les sous-zones
    }
  }
  deletSZ(id){
    var index = this.tabSousZPick.indexOf(id);
    if (index > -1) {
      this.tabSousZPick.splice(index, 1);
    }
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
  checkASZ(id){
    var index = this.tabSousZPick.indexOf(id);
    if (index > -1) {
      this.tabSousZPick.splice(index, 1);
    }else{
      this.tabSousZPick.push(id)
    }
  }
  pickNewZone(zone){
    this.tabZonesPick.push(zone.id)
    setTimeout(()=>this.addZone=true,1)
  }
  pickNewLoc(localite){
    this.tabLoc.push(localite)
    setTimeout(()=>this.addLoc=true,1)
  }
  deletCreationInst(){
    this.invCreer=false
    this.instructions=[]
    this.initInstrucForm()
  }
  deletCreationPv(){
    this.pvCreer=false
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
    this.initPvForm(valPv)
    this.tabDeliberation=new FormArray([]);
    const content="Les instructions d'inventaire ont été transmises à tous les intervenants. Ces derniers ont attesté avoir pris connaissance de celles-ci."
    const title="DELIBERATION 1: INSTRUCTIONS D'INVENTAIRE"
    this.addDeliberation(title,content)
    console.log(this.tabDeliberation.controls[0])
  }
}
