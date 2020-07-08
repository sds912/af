import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder, FormControl, Validators,FormArray, NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdminService } from '../../../administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { Entreprise } from '../../../administration/model/entreprise';
import Swal from 'sweetalert2';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.sass']
})
export class EquipeComponent implements OnInit {
  @ViewChild('roleTemplate', { static: true }) roleTemplate: TemplateRef<any>;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('closeEditModal', { static: false }) closeEditModal;
  @ViewChild('formDirective') private formDirective: NgForm;
  rows = [];
  colNmbre=5
  selectedRowData: selectRowInterface;
  newUserImg = '';
   
  data = [];
  filteredData = [];
  editForm: FormGroup;
  selectedOption: string;
  dep=[
    'Direction financière',
    'Direction comptable',
    'Direction du patrimoine',
    'Autre (à préciser)'
  ]
  roles=[//si modifier modifier la fonction getRole
    "Chef d'équipe",
    "Membre inventaire"
  ]
  show=false
  imgLink=""
  image:string;
  defaultImag="exemple.jpg";
  myId=""
  tabEse=new FormArray([]);
  autreDep=false
  entreprises=[]
  details=false
  update=false
  firstDep=""//le premier input des departements
  localites=[]
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  userLocalites=[]
  tabZonesPick=[]
  tabSousZPick=[]
  addLoc=true
  addZone=true
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar,private adminServ:AdminService,private sharedService:SharedService,public securityServ:SecurityService) {
    this.editForm = this.fb.group({
      id: [0],
      image: [''],
      username:['', [Validators.required]],
      nom: ['', [Validators.required]],
      poste: [''],
      departement: [''],
      status: ['actif'],
      role: ['',[Validators.required]]
    });
    this.imgLink=this.sharedService.baseUrl +"/images/"
    this.newUserImg = this.imgLink+this.defaultImag;
  }
  ngOnInit() {//si on recup les entreprise des users ne pas oublier de recup le getUser()
    this.securityServ.showLoadingIndicatior.next(true)
    this.myId=localStorage.getItem('idUser')
    this.getUsers()
    this.getEntreprises()
    this.securityServ.getUser()
  }
  getUsers(){
    this.adminServ.getUsers().then(
      rep=>{
        
        let users=[]
        if(rep && rep.length>0){
          users=rep.reverse();
          users=users.filter(u=>u.id!=this.myId && u.roles &&(u.roles[0]=="ROLE_CE" || u.roles[0]=="ROLE_MI"))
        }
        console.log(users)
        this.data = users;
        this.filteredData = users;
        this.show=true
        this.securityServ.showLoadingIndicatior.next(false)
      },
      error=>{
        console.log(error)
        this.securityServ.showLoadingIndicatior.next(false)
      }
    )
  }
  getEntreprises(){
    this.adminServ.getEntreprise().then(
      rep=>{
        this.entreprises=rep
      },
      error=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  addEntreprise(valeur=null) {
    this.tabEse.push(new FormControl(valeur));
    this.userLocalites.push([])//pour que userLocalites[i] soit celui de tabEse[i]
  }
  depChange(dep){
    this.autreDep=false
    this.editForm.get('departement').setValue("")
    if(dep!=this.dep[this.dep.length-1]){
      this.editForm.get('departement').setValue(dep)
    }else{
      this.autreDep=true
    }
  }
  nomChange(nom){
    if(!this.update){
      let u=nom.replace(/\ /g,"").replace(/\é/g,"e").replace(/\è/g,"e")
      this.editForm.get('username').setValue(u+'@gestion-immo.com')
    }
  }
  updateUser(user){
    this.details=false
    this.autreDep=false
    var n = this.dep.includes(user.departement);
    if(n)
      this.firstDep=user.departement
    else {
      this.firstDep=this.dep[this.dep.length-1]
      this.autreDep=true
    }
    this.traitementUpdate(user)
    
    this.update=true
    this.editRow(user)
  }
  traitementUpdate(user){
    this.tabEse=new FormArray([]);
    this.userLocalites=[]
    this.tabZonesPick=[]
    this.tabSousZPick=[]
    let entreprises=user.entreprises
    for(let i=0;i<entreprises.length;i++){
      let idEse=entreprises[i].id
      this.addEntreprise(idEse)
      user.localites.forEach(l=>{
        if(idEse==l.idEntreprise) this.pickNewLoc(l.id,i,l.idEntreprise)
      });
      user.zones.forEach(z=>{
        if(idEse==z.idEntreprise) this.pickNewZone(z.id)
      });
      user.sousZones.forEach(sz=>{
        if(idEse==sz.idEntreprise) this.checkASZ(sz.id)
      });
    }
  }
  editRow(row,lock=false) {
     if(this.formDirective)this.formDirective.resetForm()
    this.editForm = this.fb.group({
      id: [{value: row.id, disabled: lock}],
      image: [{value: row.image, disabled: lock}],
      username:[{value: row.username, disabled: lock}, [Validators.required]],
      nom: [{value: row.nom, disabled: lock}, [Validators.required]],
      poste: [{value: row.poste, disabled: lock}],
      departement: [{value: row.departement, disabled: lock}],
      status: ['actif'],
      role: [{value: this.getRole(row.roles), disabled: lock}, [Validators.required]]
    });
    this.selectedRowData = row;
  }
  lockRow(user){
    let mot="débloqué"
    let mot2="déblocage"
    if(user.status=="actif"){
      mot="bloqué"
      mot2="blocage" 
    }
    Swal.fire({
      title: 'Confirmation',
      text: "Voulez-vous confirmer le "+mot2+" de l'utilisateur "+user.nom+' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.value) {
        this.securityServ.showLoadingIndicatior.next(true)
        this.adminServ.lockUser(user.id).then(
          rep=>{
            this.securityServ.showLoadingIndicatior.next(false)
            this.showNotification('bg-success','Utilisateur '+mot,'bottom','center')
            this.getUsers()
          },
          message=>{
            this.securityServ.showLoadingIndicatior.next(false)
            this.showNotification('bg-red',message,'bottom','right')
          }
        )
      }
    });
  }
  longText(text,limit){
    return this.sharedService.longText(text,limit)
  }
  addRow() {
    this.firstDep=""
    this.details=false
    this.autreDep=false
    this.update=false
    this.tabEse=new FormArray([]);
    this.userLocalites=[]
    this.tabZonesPick=[]
    this.tabSousZPick=[]
    let id=""
    if (this.entreprises && this.entreprises.length>0)id=this.entreprises[0].id
    this.addEntreprise(id)//rempli l id si il y a une seule entreprise aussi
    this.getOneEntreprise(id)
    let user={id:0,username:'',nom:'',poste:'',departement:'',role:'',image:this.defaultImag,status:'actif'}
    this.editRow(user)
  }
  showDetails(row){
    console.log(row)
    this.autreDep=false
    this.traitementUpdate(row)
    var n = this.dep.includes(row.departement);//si son departement est dans la liste
    if(n)
      this.firstDep=row.departement
    else {
      this.firstDep=this.dep[this.dep.length-1]//autre dep
      this.autreDep=true
    }
    this.details=true
    this.editRow(row,true)
  }
  getDenomination(id){
    let denomination=""
    if (this.entreprises && this.entreprises.length>0 && id)denomination=this.entreprises.find(e=>e.id==id).denomination
    return denomination
  }
  getEntreprise(id){
    let e=null
    if (this.entreprises && this.entreprises.length>0 && id)e=this.entreprises.find(e=>e.id==id)
    return e
  }
  onEditSave(form: FormGroup) {
    this.securityServ.showLoadingIndicatior.next(true)
    let data=form.value
    let e=[]
    this.tabEse.value.forEach(id =>{
      if(id) e.push("/api/entreprises/"+id)
    });
    data.entreprises=e
    data.roles=[this.getRole(data.role,false)]
    data.localites=this.getDataLoc()
    data.zones=this.getDataZone()
    data.sousZones=this.getDataSZ() // un mot de passe par defaut ajouter à PasswordEncoderSubscriber et le status
    this.adminServ.addUser(data).then(
      rep=>{
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-success','Enregistré','bottom','center')
        this.closeEditModal.nativeElement.click();
        this.getUsers()
      },message=>{
        console.log(message)
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-red',message,'bottom','right')
      }
    )
  }
  getDataLoc(){
    let localites=[]
    this.userLocalites.forEach(tab=>
      tab.forEach(l => {
        if(l && l.id) localites.push("/api/localites/"+l.id)
      })
    )
    return localites
  }
  getDataZone(){
    let zones=[]
    this.tabZonesPick.forEach(id => {
      if(id) zones.push("/api/zones/"+id)
    });
    return zones
  }
  getDataSZ(){
    let sousZones=[]
    this.tabSousZPick.forEach(id => {
        if(id) sousZones.push("/api/sous_zones/"+id)
    });
    return sousZones
  }
  getRole(role,show=true){
    let r1='',r2=''
    if(role && (role=="Chef d'équipe"||role[0]=="ROLE_CE")){
      r1="Chef d'équipe"
      r2="ROLE_CE"
    }else if(role && (role=="Membre inventaire"||role[0]=="ROLE_MI")){
      r1="Membre inventaire"
      r2="ROLE_MI"
    }
    if(show)return r1
    return r2
  }
  filterDatatable(event) {
    // get the value of the key pressed and make it lowercase
    const val = event.target.value.toLowerCase();
    // get the amount of columns in the table
    const colsAmt = this.colNmbre//this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);
    // assign filtered matches to the active datatable
    this.data = this.filteredData.filter(function(item) {
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
      panelClass: colorName
    });
  }
  backupPwd(user){
    Swal.fire({
      title: 'Confirmation',
      text: "Voulez-vous confirmer la réinitialisation du mot de passe de l'utilisateur "+user.nom+' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.value) {
        this.securityServ.showLoadingIndicatior.next(true)
        this.adminServ.backupPWD(user.id).then(
          rep=>{
            this.securityServ.showLoadingIndicatior.next(false)
            this.showNotification('bg-success',"Mot de passe réinitialisé",'bottom','center')
            this.getUsers()
          },
          message=>{
            this.securityServ.showLoadingIndicatior.next(false)
            this.showNotification('bg-red',message,'bottom','right')
          }
        )
      }
    });
  }
  rev(tab){
    let t=[]
    if(tab && tab.length>0){
      t=tab
      this.sharedService.trier(t,'id',-1)
    }
    return t
  }
  getOneEntreprise(id){
    this.adminServ.getOneEntreprise(id).then(
      rep=>{
        this.localites=rep.localites
      },
      error=>{
        //this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  deleteLoc(localite,i){
    let index=this.userLocalites[i].indexOf(localite)
    if (index > -1) {
      this.userLocalites[i].splice(index, 1);
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
  pickNewLoc(id,i,idEse){//l id de la localite, index dans la liste et id de l entreprise
    const localites=this.getEntreprise(idEse).localites
    const localite=localites.find(l=>l.id==id)
    if(localite) this.userLocalites[i].push(localite)
    setTimeout(()=>this.addLoc=true,1)
  }
  locIsPick(id,i){
    const localites=this.userLocalites[i]
    return localites.find(l=>l.id==id)
  }
  pickNewZone(id){
    this.tabZonesPick.push(id)
    setTimeout(()=>this.addZone=true,1)
  }
  zoneIsPick(id){
    return this.tabZonesPick.find(idZ=>idZ==id)
  }
  sousZIsPick(id){
    return this.tabSousZPick.find(idSZ=>idSZ==id)
  }
  checkASZ(id){
    var index = this.tabSousZPick.indexOf(id);
    if (index > -1) {
      this.tabSousZPick.splice(index, 1);
    }else{
      this.tabSousZPick.push(id)
    }
    console.log(this.tabSousZPick)
  }
  inTabEse(valeur){
    return this.tabEse.value.find(id=>id==valeur);
  }
  trierSZ(sousZones){
    return this.sharedService.trier(sousZones,'id')
  }
}
export interface selectRowInterface {
  image: String;
  denomination: String;
  republique: String;
}
