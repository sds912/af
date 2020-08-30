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
  debutPeriode=null
  finPeriode=null
  debut=null
  fin=null
  idAffectation=0
  myId=''
  curAffectation=null
  myTabLocAffecte=[]
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
    this.subdivisions?.forEach(sub => this.tabOpen.push(0))
    this.getAffectationOf(user)
  }

  getAffectationOf(user){
    /** L'affectation d'un utilisateur */
    this.planingServ.getAffectations(`?user.id=${user.id}&inventaire.id=${this.currentInv?.id}`).then(
      rep=>{
        /** Je l ai modélisé ainsi au cas ou on doive faire une date pour chaque localité pour l instant on utilise juste localites qui est du json */
        /** si change revoir hiddenLoc */
        this.curAffectation=rep[0]
        this.idAffectation=this.curAffectation?this.curAffectation.id:0
        this.debut=this.curAffectation?.debut
        this.fin=this.curAffectation?.debut
        
        /** utiliser le user de getAffectationOf(user) car ses infos sont plus nombres */
        const hisLocalite=this.getLocOpenUser(user,this.curAffectation?.localites)
        this.tabLoc = []
        hisLocalite?.forEach((l: any) => this.checkLoc(l,true));
      },error=>{
        console.log(error)
      }
    )
  }
    
  getLocOpenUser(user,tabIdLocalites){
    /** si on choisi un adjoint charger les localités qu'il a créé */
    if(user.roles?.indexOf("ROLE_SuperViseurAdjoint")>=0){
      return this.localites.filter(loc=>loc?.createur?.id==user.id)
    }
    /** Les autres charger les localités ou on les a affecté */
    let tab=[]
    tabIdLocalites?.forEach(id => tab.push(this.getOnById(id)));
    return tab
  }
  save():void{
    this.securityServ.showLoadingIndicatior.next(true)
    const data={
      id:this.idAffectation,
      user:`/api/users/${this.currentUser.id}`,
      inventaire:`/api/inventaires/${this.currentInv.id}`,
      localites:this.tabLoc,
      debut:this.debut,
      fin:this.fin
    }
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
  hiddenLoc(loc):boolean{
    const cas1=this.securityServ.superviseurAdjoint && loc?.createur?.id!=this.myId
    /** si chef d equipe et qu on nous y a pas affecter */
    const cas2=this.securityServ.chefEquipe && this.myTabLocAffecte?.indexOf(loc.id)<=-1    
    if(cas1 || cas2){
      return true
    }
    return false
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
    const user=this.currentUser
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
  checkLoc(loc,addOnly=false) {
    var index = this.tabLoc.indexOf(loc.id);
    if(index > -1 && !addOnly) {
      this.tabLoc.splice(index, 1);
    }else if(index <= -1) {
      this.tabLoc.push(loc.id)
      const idParent = loc.idParent
      if (idParent && !this.inTab(idParent, this.tabLoc)) this.checkLoc(this.getOnById(idParent))//cocher les parents recursif
    }
  }
  inInvLoc(id):boolean {
    /** on ne peut pas utiliser inTab car l un sera chercher sur les localites et l autre sur les subdivisions d une localites */
    return this.localites?.find(loc => loc.id == id)!=null;
  }
  inTab(valeur, tab) {
    return tab?.find(id => id == valeur);
  }
  getOnById(id) {
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
    let l = this.getOnById(id)?.subdivisions
    return l ? l : []
  }
  openOther(i, id) {
    this.tabOpen[i] = id
    this.offUnderSub(i + 1)//les surdivisions en dessous
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
}
