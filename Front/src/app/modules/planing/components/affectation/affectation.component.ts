import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/modules/administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { InventaireService } from 'src/app/modules/inventaire/service/inventaire.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PlaningService } from '../../services/planing.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export interface User {
  image: string;
  nom: string;
  departement: string;
  poste: string;
  action?: string;
}
@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.component.html',
  styleUrls: ['./affectation.component.sass']
})
export class AffectationComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  colNmbre = 5
  totalMessage = "Total"
  data=[]
  filteredData=[]
  idCurrentEse=""
  inventaires=[]
  show=false
  imgLink=""
  currentUser=null
  subdivisions = []
  localites = []
  details=false
  tabLoc = []
  openLocalite = null
  tabOpen = []
  idCurrentInv=null
  currentInv=null
  roles = [
    {role:"ROLE_MI",level:1},
    {role:"ROLE_CE",level:2},
    {role:"ROLE_SuperViseurAdjoint",level:3},
    {role:"ROLE_SuperViseurGene",level:4},
    {role:"ROLE_Superviseur",level:5}
  ]
  update=false
  debutPeriodeOctroyer=null
  finPeriodeOctroyer=null
  debut=null
  fin=null
  myId=''
  curAffectation=null
  myTabLocAffecte=[]
  tabPeriodeAffectation=[]
  idLocCurrentAffectation=null
  dateProposition=false
  idLocError=null
  infoTextError=''
  invIsClose=false
  constructor(private fb: FormBuilder, 
              private _snackBar: MatSnackBar, 
              private adminServ: AdminService, 
              private sharedService: SharedService, 
              public securityServ: SecurityService,
              private inventaireServ: InventaireService,
              private planingServ: PlaningService) 
  {
    this.imgLink = this.sharedService.baseUrl + "/images/"
  }
  
  //revoir periode de contage quand on click sur un nouveau
  ngOnInit() {
    this.myId = localStorage.getItem('idUser')
    this.securityServ.showLoadingIndicatior.next(false)
    this.idCurrentEse=localStorage.getItem("currentEse")
    this.getInventaireByEse()
    this.getOneEntreprise(this.idCurrentEse)

  }
  openAffectation(id){
    this.idLocCurrentAffectation=id
    let affect=this.tabPeriodeAffectation.find(affectation=>affectation?.localite?.id==id)
    if(!affect){
      /** Si n'existe pas l ajouter */
      affect={localite:{id:id},debut:null,fin:null}
      this.tabPeriodeAffectation.push(affect)
    }
    this.debut=affect?.debut
    this.fin=affect?.fin
    this.dateProposition=false
    if(!this.debut && !this.fin && this.update){
      /** Pour lui proposer de garder la même date que la date qu on lui a accorder */
      this.debut=affect?.debut ? affect?.debut : this.getDateComptage()?.debut
      this.fin=affect?.fin ? affect?.fin :this.getDateComptage()?.fin
      this.dateChange()
      this.dateProposition=true
    }
  }
  dateChange(){    
    let affect=this.tabPeriodeAffectation.find(affectation=>affectation?.localite?.id==this.idLocCurrentAffectation)
    var index = this.tabPeriodeAffectation.indexOf(affect);
    if(index > -1) {
      /** Sup et remplacer */
      this.tabPeriodeAffectation.splice(index, 1);
    }
    affect.debut=this.debut
    affect.fin=this.fin
    this.tabPeriodeAffectation.push(affect)
  }
  getTabLocAffectation(){
    this.planingServ.getTabLocAffectation(this.idCurrentInv).then(
      rep => {
        this.myTabLocAffecte=rep
        this.forCorrection()
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  forCorrection(){
    /** Si le superviseur general affect un superviseur adjoint les loc filles 
    * prennent la duree du parent mais si le superviseur general ajout une localité 
    * a l inventaire apres affecation sa duree sera null 
    */
    if(this.securityServ.superviseurAdjoint){
      const myLoc=this.localites.filter(loc=>loc?.createur?.id==this.myId)
      const toCorrect=[]
      myLoc.forEach(loc=>{
        const locAffecte=this.myTabLocAffecte.find(aff=>aff.localite.id==loc.id)
        if(!locAffecte){
          const idParent=this.getOneById(loc.id)?.idParent
          const parrentAff=this.myTabLocAffecte.find(aff=>aff.localite.id==idParent)
          const debut=parrentAff?parrentAff.debut:null
          const fin=parrentAff?parrentAff.fin:null
          toCorrect.push({localite:{id:loc.id},debut:debut,fin:fin})
        }
      })
      if(toCorrect.length>0){
        this.saveCorrection(toCorrect)
      }
    }
  }
  saveCorrection(affectationToCorect){
    const data={
      user:this.myId,
      inventaire:this.currentInv.id,
      affectations:affectationToCorect,
      remove:false
    }    
    this.planingServ.addAfectation(data)
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this._snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: [colorName,'color-white']
    });
  }
  getMyAffectation(){
    return this.myTabLocAffecte.find(tab=>tab?.localite?.id==this.idLocCurrentAffectation)
  }
  getInventaireByEse() {
    this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(
      rep => {
        this.inventaires = rep?.reverse()
        this.currentInv=rep?rep[0]:null
        this.invIsClose=this.currentInv?.status=="close"?true:false
        this.idCurrentInv=this.currentInv?.id
        this.localites = this.currentInv?.localites
        this.getUsers()
        this.getTabLocAffectation()
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  getOneEntreprise(id) {
    this.adminServ.getOneEntreprise(id).then(
      rep => {
        this.subdivisions=rep.subdivisions
      },
      error => {
        //this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  getUsers() {
    /** voir doctrine/MyUser du Bac pour comprendre comment seul les users de l entreprise s affiche */
    this.adminServ.getUsers().then(
      rep => {
        this.securityServ.showLoadingIndicatior.next(false)
        const users=this.trierByRole(rep,-1)
        this.data = users?.filter(u=>this.isShow(u))
        this.filteredData=this.data
        const currentUser=this.data && this.data.length> 0 ? this.data[0] : null
        this.openOn(currentUser)
        this.show=true
      },
      error => {
        console.log(error)
        this.securityServ.showLoadingIndicatior.next(false)
      }
    )
  }
  openOn(user){
    this.update=false
    this.currentUser=user
    this.tabOpen = []
    this.idLocCurrentAffectation=null
    this.debut=null
    this.fin=null
    this.subdivisions?.forEach(sub => this.tabOpen.push(0))
    this.getAffectationOf(user)
  }
  getAffectationOf(user){
    /** L'affectation d'un utilisateur */
    this.planingServ.getAffectations(`?user.id=${user.id}&inventaire.id=${this.currentInv?.id}`).then(
      rep=>{
        this.tabPeriodeAffectation=rep
        /** Les id de toutes les localités de la personne */
        const locIds=this.getAllLocId(this.tabPeriodeAffectation)
        /** POur gerer a la fois les superviseurs adjoints et les autres */
        const hisLocalite=this.getLocOpenUser(user,locIds)
        this.tabLoc = []        
        hisLocalite?.forEach((l: any,i) => {
          this.checkLoc(l,true)
        });
      },error=>{
        console.log(error)
      }
    )
  }
  getAllLocId(tab){
    let t=[]
    tab?.forEach(affectation => t.push(affectation?.localite?.id));
    return t
  }
  getLocOpenUser(user,tabIdLocalites){
    /** si on choisi un adjoint charger les localités qu'il a créé */
    if(user.roles?.indexOf("ROLE_SuperViseurAdjoint")>=0){
      return this.localites.filter(loc=>loc?.createur?.id==user.id)
    }
    /** Les autres charger les localités ou on les a affecté */
    let t=[]
    tabIdLocalites?.forEach(id => t.push(this.getOneById(id)));
    return t
  }
  getAffectationToSave(){
    /** Si cocher mais non affecter */
    this.tabLoc.forEach(id=>{
      const existe=this.tabPeriodeAffectation.find(affectation=>affectation?.localite?.id==id)
      if(!existe){
        this.tabPeriodeAffectation.push({localite:{id:id},debut:null,fin:null})
        /** ajouter si ajout les fils auront la meme duree d afectation que le first sub */
      }
    })
    /** si decocher mais affecter avant */
    this.tabPeriodeAffectation.forEach((affectation,index)=>{
      const cocher=this.tabLoc.find(idL=>idL==affectation?.localite?.id)
      if(!cocher){
        this.tabPeriodeAffectation.splice(index, 1);
      }
    })
    this.samePeriodeForSon()
    return this.tabPeriodeAffectation
  }
  samePeriodeForSon(){
    if(this.securityServ.superviseurGene){
      /** Pour les superviseurs adjoints les fils auront la meme duree d afectation que la 1ere subdivision */
      const parents=this.localites.filter(loc=>loc.idParent==null)
      
      parents?.forEach(parent=>{
        const affectation=this.tabPeriodeAffectation.find(aff=>aff.localite.id==parent.id)
        const debut=affectation?.debut
        const fin=affectation?.fin
        this.loopSone(parent,debut,fin)
      })
    }
  }
  loopSone(parent,debut,fin){
    const fils=this.localites.filter(loc=>loc.idParent==parent.id)
    fils?.forEach(one=>{
      const filsAffect=this.tabPeriodeAffectation.find(aff=>aff.localite.id==one.id)
      let index = this.tabPeriodeAffectation.indexOf(filsAffect);
      if(index > -1) {
        /** Sup et remplacer */
        this.tabPeriodeAffectation.splice(index, 1);
      }
      if(filsAffect){
        filsAffect.debut=debut
        filsAffect.fin=fin
        this.tabPeriodeAffectation.push(filsAffect)
      }
      /** Pour ces fils à lui */
      this.loopSone(one,debut,fin)
    })
  }
  save():void{
    /** ajouter si ajout les fils auront la meme duree d afectation que le first sub */
    this.securityServ.showLoadingIndicatior.next(true)
    const data={
      user:this.currentUser.id,
      inventaire:this.currentInv.id,
      affectations:this.getAffectationToSave(),
      remove:true
    }
    this.planingServ.addAfectation(data).then(
      rep=>{
        this.update=false
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-success','Enregistré','top','center')
      },error=>{
        console.log(error);
        this.securityServ.showLoadingIndicatior.next(false)
      }
    )
  }
  off(){
    this.openOn(this.currentUser)
  }
  
  isShow(user):boolean{
    const service=this.securityServ
    /** superviseur general voit sup adjoint, chef equipe et membre inventaire */
    const cas1=(service.superviseurGene && 
      (
       user.roles?.indexOf("ROLE_SuperViseurAdjoint")>=0 || 
       user.roles?.indexOf("ROLE_CE")>=0 || 
       user.roles?.indexOf("ROLE_MI")>=0
      )
    )
    /** sup adjoint et sup voit chef equipe et membre inventaire */
    const cas2=(service.superviseur || service.superviseurAdjoint) && (
      (
        user.roles?.indexOf("ROLE_CE")>=0 || 
        user.roles?.indexOf("ROLE_MI")>=0
      )
    )
    /** chef equipe voit membre inventaire */
    const cas3=service.chefEquipe &&  user.roles?.indexOf("ROLE_MI")>=0
    
    if(cas1 || cas2 || cas3){
      return true
    }
    return false
  }
  styleGree(user){
    const service=this.securityServ

    const cas1=service.superviseurGene && user.roles?.indexOf("ROLE_SuperViseurAdjoint")<0

    const cas2=(service.superviseur || service.superviseurAdjoint) && user.roles?.indexOf("ROLE_CE")<0

    const cas3=service.chefEquipe &&  user.roles?.indexOf("ROLE_MI")<0

    if(cas1 || cas2 || cas3){
      return true
    }
    return false
  }
  isEditable():boolean{
    const service=this.securityServ

    const user=this.currentUser
    /** superviseur general edit sup adjoint */
    const cas1 = service.superviseurGene && user?.roles?.indexOf("ROLE_SuperViseurAdjoint")>=0

    /** sup adjoint et sup edit chef equipe */
    const cas2=(service.superviseur || service.superviseurAdjoint) && user?.roles?.indexOf("ROLE_CE")>=0
    
    /** chef equipe edit membre inventaire */
    const cas3=service.chefEquipe &&  user?.roles?.indexOf("ROLE_MI")>=0
    
    if(cas1 || cas2 || cas3){
      return true
    }
    return false
  }
  editOne(){
    this.update=true
  }
  inventaireChange(id){
    this.currentInv=this.inventaires.find(inv=>inv.id==id)
    this.invIsClose=this.currentInv?.status=="close"?true:false    
    this.localites = this.currentInv?.localites
    this.getTabLocAffectation()
  }
  longText(text, limit) {
    return this.sharedService.longText(text, limit)
  }
  filterDatatable(value) {
    // get the value of the key pressed and make it lowercase
    const val = value.toLowerCase();
    // get the amount of columns in the table
    const colsAmt = this.colNmbre//this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);
    // assign filtered matches to the active datatable
    this.data = this.filteredData.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        // check for a match
        if (
          item[keys[i]]
            .toString()
            .toLowerCase()
            .indexOf(val) !== -1 ||
          !val
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  firstSub(localites) {
    return localites?.filter(loc => loc.position?.length > 0)
  }
  inInvLoc(id):boolean {
    /** on ne peut pas utiliser inTab car l un sera chercher sur les localites et l autre sur les subdivisions d une localites */
    return this.localites?.find(loc => loc.id == id)!=null;
  }
  inTab(valeur, tab) {
    return tab?.find(id => id == valeur);
  }
  getOneById(id) {
    let l = this.localites?.find(loc => loc.id == id)
    return l ? l : null
  }
  openFirst(e, id) {
    this.openLocalite = id
    this.tabOpen[0] = id
    this.offUnderSub(1)
    document.querySelectorAll('.pic-loc-first').forEach((ele: HTMLElement) => {
      ele.classList.remove('active');
    });
    (e.target as HTMLElement).closest('.pic-loc-first').classList.add('active');
  }
  offUnderSub(j) {
    for (let i = j; i < this.tabOpen.length; i++) {
      if (this.tabOpen[i]) this.tabOpen[i] = 0
    }
  }
  getCurrentSubById(id) {
    let l = this.getOneById(id)?.subdivisions
    return l ? l : []
  }
  openOther(e, i, id) {
    this.tabOpen[i] = id
    console.log('e')
    this.offUnderSub(i + 1)//les surdivisions en dessous
    document.querySelectorAll('.pic-localite-'+i).forEach((ele: HTMLElement) => {
      ele.classList.remove('active');
    });
    (e.target as HTMLElement).closest('.pic-localite-'+i).classList.add('active');
  }
  getRole(role, show = true):string {
    let r1 = '', r2 = ''
    if (role && (role == 'Superviseur' || role[0] == "ROLE_Superviseur")) {
      r1 = 'Superviseur'
      r2 = "ROLE_Superviseur"
    }
    else if (role && (role == 'Superviseur général' || role[0] == "ROLE_SuperViseurGene")) {
      r1 = 'Superviseur général'
      r2 = "ROLE_SuperViseurGene"
    }
    else if (role && (role == 'Superviseur adjoint' || role[0] == "ROLE_SuperViseurAdjoint")) {
      r1 = 'Superviseur adjoint'
      r2 = "ROLE_SuperViseurAdjoint"
    } else if (role && (role == 'Guest' || role[0] == "ROLE_Guest")) {
      r1 = 'Guest'
      r2 = "ROLE_Guest"
    } else if (role && (role == 'Président du comité' || role[0] == "ROLE_PC")) {
      r1 = 'Président du comité'
      r2 = "ROLE_PC"
    } else if (role && (role == 'Membre du comité' || role[0] == "ROLE_MC")) {
      r1 = 'Membre du comité'
      r2 = "ROLE_MC"
    } else if (role && (role == "Chef d'équipe" || role[0] == "ROLE_CE" || role == "Chef d'équipe de comptage")) {
      r1 = "Chef d'équipe de comptage"
      r2 = "ROLE_CE"
    } else if (role && (role == "Membre inventaire" || role[0] == "ROLE_MI" || role == "Membre d'équipe de comptage")) {
      r1 = "Membre d'équipe de comptage"
      r2 = "ROLE_MI"
    }
    if (show) return r1
    return r2
  }
  checkAllLoc() {
    const allIsCheck = this.allLocIsChec()
    if (allIsCheck) {
      //ne pas mettre this.tabLoc=[] car si un superviseur adjout enleve tous il doit reste ceux des autres sup adjoints
      this.localites.forEach(localite => {
        if (this.inTab(localite.id, this.tabLoc)) this.checkLoc(localite)
      })
      return
    }
    this.localites.forEach(localite => {
      if (!this.inTab(localite.id, this.tabLoc)) this.checkLoc(localite)
    })
  }
  allLocIsChec() {
    let bool = true
    this.localites.forEach(localite => {
      if (bool) bool = this.inTab(localite.id, this.tabLoc)
    })
    return bool
  }
  checkLoc(loc,addOnly=false) {
    /** revoir car ca doit etre de la forme {localite,debut,fin} */
    if(loc){
      var index = this.tabLoc.indexOf(loc.id);
      if(index > -1 && !addOnly) {
        this.tabLoc.splice(index, 1);
      }else if(index <= -1) {
        this.tabLoc.push(loc.id)
        const idParent = loc.idParent
        if (idParent && !this.inTab(idParent, this.tabLoc)) this.checkLoc(this.getOneById(idParent))//cocher les parents recursif
      }
    }
  }
  hiddenLoc(loc):boolean{
    /**revoir */
    const cas1=this.securityServ.superviseurAdjoint && loc?.createur?.id!=this.myId
    /** si chef d equipe et qu on nous y a pas affecter */
    const cas2=this.securityServ.chefEquipe && this.myTabLocAffecte.find(tab=>tab?.localite?.id==loc?.id)==null   
    if(cas1 || cas2){
      return true
    }
    return false
  }
  disabledInput():boolean{
    this.idLocError=null
    this.infoTextError=''
    const service=this.securityServ
    const inv=this.currentInv
    const myPeriode=this.getDateComptage()
    const cas1= !service.superviseurGene && !service.superviseur && (myPeriode && (new Date(this.debut)<new Date(myPeriode.debut)||new Date(this.fin)>new Date(myPeriode.fin)))
    const cas2=(service.superviseurGene || service.superviseur) && (inv && (new Date(this.debut)<new Date(inv.debut)||new Date(this.fin)>new Date(inv.fin)))
    const cas3=new Date(this.debut)>new Date(this.fin)

    /** La durée du parent */
    let cas4=false
    for (let i=0; i<this.tabPeriodeAffectation.length;i++) {
      const aff=this.tabPeriodeAffectation[i]
      const localite=this.getOneById(aff.localite.id)
      if(localite?.idParent){
        const affectParent=this.tabPeriodeAffectation.find(affectation=>affectation?.localite?.id==localite?.idParent)
        const checked=this.inTab(aff.localite.id,this.tabLoc)
        if(!service.superviseurGene && affectParent && checked && (new Date(aff.debut)<new Date(affectParent.debut)||new Date(aff.fin)>new Date(affectParent.fin))){
          //console.log(affectParent,this.getOneById(affectParent.localite.id),new Date(aff.fin),new Date(affectParent.fin));
          this.idLocError=affectParent.localite.id
          const nom1=this.getOneById(this.idLocError).nom
          const p1_1=this.formattedDate(new Date(affectParent.debut))
          const p1_2=this.formattedDate(new Date(affectParent.fin))
          const nom2=this.getOneById(aff.localite.id).nom
          const p2_1=this.formattedDate(new Date(aff.debut))
          const p2_2=this.formattedDate(new Date(aff.fin))
          this.infoTextError="Revoir la période car celle de '"+nom1+"' est du "+p1_1+' au '+p1_2+
                             ", tandis que celui de '"+nom2+"' est du "+p2_1+' au '+p2_2
          cas4=true
          break
        }
      }
    }
    
    if(cas1 || cas2 || cas3 || cas4){
      return true
    }
    return false
  }
  formattedDate(d = new Date) {
    d = new Date(d)
    return [d.getDate(), d.getMonth() + 1, d.getFullYear()].map(n => n < 10 ? `0${n}` : `${n}`).join('-');
  }
  getDateComptage(){
    const service=this.securityServ
    const idCurLoc=this.idLocCurrentAffectation
    const localite=this.getOneById(idCurLoc)
    
    if(!localite?.idParent && (service.superviseurGene || service.superviseur)){
      return this.currentInv
    }
    else if(localite?.idParent && (service.superviseurAdjoint||service.superviseur)){
      const affectParent=this.tabPeriodeAffectation.find(affectation=>affectation?.localite?.id==localite?.idParent)
      return affectParent
    }
    /** si celui donné par son n+1 */
    return this.getMyAffectation()
  }
  isErrorDate(number):boolean{
    if(number==0 && 
      this.getDateComptage() && new Date(this.getDateComptage()?.debut)>new Date(this.debut) ||
      new Date(this.debut)>new Date(this.getDateComptage()?.fin) || 
      this.debut && this.fin && new Date(this.debut)>new Date(this.fin)){
      return true
    }
    if(number==1 && this.getDateComptage() && new Date(this.getDateComptage()?.fin)<new Date(this.fin)||
      new Date(this.getDateComptage()?.debut)>new Date(this.fin)
    ){
      return true
    }
    return false
  }
  trierByRole(tab,ordre=1){//trie objet, si decroissant ordre=-1 ex: this.trier(clients,'nombre',-1)
    return tab.sort((a,b)=>{
      const arole=this.getRoleLevel(a?.roles)
      const brole=this.getRoleLevel(b?.roles)
      if (arole > brole) return 1*ordre;
      else if (brole > arole) return -1*ordre;
      return 0;
    })
  }

  getRoleLevel(roles):number{
    return this.roles?.find(r=>r.role==roles[0])?this.roles.find(r=>r.role==roles[0]).level:0
  }
}