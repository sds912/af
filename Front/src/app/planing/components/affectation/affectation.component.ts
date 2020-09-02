import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { InventaireService } from 'src/app/inventaire/service/inventaire.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PlaningService } from '../../services/planing.service';

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
    "Chef d'équipe",
    "Membre inventaire",
    'Superviseur',
    'Superviseur général',
    'Superviseur adjoint',
    'Guest',
    'Président du comité',
    'Membre du comité'
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
    console.log(this.tabPeriodeAffectation);
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
        console.log(rep);
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  getMyAffectation(){
    return this.myTabLocAffecte.find(tab=>tab?.localite?.id==this.idLocCurrentAffectation)
  }
  getInventaireByEse() {
    this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(
      rep => {
        this.inventaires = rep
        this.currentInv=rep?rep[0]:null
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
        this.data = rep?.filter(u=>this.isShow(u))
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
        hisLocalite?.forEach((l: any) => this.checkLoc(l,true));
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
        })
      })
    }
  }
  save():void{
    /** ajouter si ajout les fils auront la meme duree d afectation que le first sub */
    this.securityServ.showLoadingIndicatior.next(true)
    const data={
      user:this.currentUser.id,
      inventaire:this.currentInv.id,
      affectations:this.getAffectationToSave()
    }
    console.log(this.tabLoc,data);

    this.planingServ.addAfectation(data).then(
      rep=>{
        this.update=false
        this.securityServ.showLoadingIndicatior.next(false)
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
    const cas1 = service.superviseurGene && user.roles?.indexOf("ROLE_SuperViseurAdjoint")>=0

    /** sup adjoint et sup edit chef equipe */
    const cas2=(service.superviseur || service.superviseurAdjoint && user.roles?.indexOf("ROLE_CE")>=0)
    
    /** chef equipe edit membre inventaire */
    const cas3=service.chefEquipe &&  user.roles?.indexOf("ROLE_MI")>=0
    
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
    this.localites = this.currentInv?.localites
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
  openFirst(id) {
    this.openLocalite = id
    this.tabOpen[0] = id
    this.offUnderSub(1)
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
  openOther(i, id) {
    this.tabOpen[i] = id
    this.offUnderSub(i + 1)//les surdivisions en dessous
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
    var index = this.tabLoc.indexOf(loc.id);
    if(index > -1 && !addOnly) {
      this.tabLoc.splice(index, 1);
    }else if(index <= -1) {
      this.tabLoc.push(loc.id)
      const idParent = loc.idParent
      if (idParent && !this.inTab(idParent, this.tabLoc)) this.checkLoc(this.getOneById(idParent))//cocher les parents recursif
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
}
