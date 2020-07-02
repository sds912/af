import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder, FormControl, Validators,FormArray } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { Entreprise } from '../../model/entreprise';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {
  @ViewChild('roleTemplate', { static: true }) roleTemplate: TemplateRef<any>;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('closeEditModal', { static: false }) closeEditModal;
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
    'Superviseur',
    'Guest',
    'Président du comité',
    'Membre adjoint du comité'
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
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar,private adminServ:AdminService,private sharedService:SharedService,public securityServ:SecurityService) {
    this.editForm = this.fb.group({
      id: [0],
      image: [''],
      username:['', [Validators.required]],
      nom: ['', [Validators.required]],
      poste: [''],
      departement: [''],
      status: ['actif'],
      role: ['']
    });
    this.imgLink=this.sharedService.baseUrl +"/images/"
    this.newUserImg = this.imgLink+this.defaultImag;
  }
  ngOnInit() {//si on recup les entreprise des users ne pas oublier de recup le getUser()
    this.myId=localStorage.getItem('idUser')
    this.getUsers()
    this.securityServ.getUser()
  }
  getUsers(){
    this.adminServ.getUsers().then(
      rep=>{
        if(this.securityServ.user) this.entreprises=this.securityServ.user.entreprises//pour des problemes d async mieu vaut le recuperer encore plus tard celui la c est plutot pour cacher le bouton add user
        let users=[]
        if(rep && rep.length>0){
          users=rep.reverse();
          users=users.filter(u=>u.id!=this.myId)
        }
        this.data = users;
        this.filteredData = users;
        this.show=true
      },
      error=>console.log(error)
    )
  }
  addEntreprise(valeur='') {
    this.tabEse.push(new FormControl(valeur));
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

    this.tabEse=new FormArray([]);
    user.entreprises.forEach(e =>  this.addEntreprise(e.id));

    this.update=true
    this.editRow(user)
  }
  editRow(row,lock=false) {
    this.entreprises=this.securityServ.user.entreprises//pour des problemes d async de securityServ.getUser()
    this.editForm = this.fb.group({
      id: [{value: row.id, disabled: lock}],
      image: [{value: row.image, disabled: lock}],
      username:[{value: row.username, disabled: lock}, [Validators.required]],
      nom: [{value: row.nom, disabled: lock}, [Validators.required]],
      poste: [{value: row.poste, disabled: lock}],
      departement: [{value: row.departement, disabled: lock}],
      status: ['actif'],
      role: [{value: this.getRole(row.roles), disabled: lock}]
    });
    this.selectedRowData = row;
  }
  lockRow(user){
    let mot="débloqué"
    if(user.status=="actif")mot="bloqué"
    this.adminServ.lockUser(user.id).then(
      rep=>{
        this.showNotification('bg-success','Utilisateur '+mot,'bottom','center')
        this.getUsers()
      },
      message=>this.showNotification('bg-red',message,'bottom','right')
    )
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
    let id=""
    if (this.entreprises && this.entreprises.length>0)id=this.entreprises[0].id
    this.addEntreprise(id)//rempli l id si il y a une seule entreprise aussi
    let user={id:0,username:'',nom:'',poste:'',departement:'',role:'',image:this.defaultImag,status:'actif'}
    this.editRow(user)
  }
  showDetails(row){
    console.log(row)
    this.autreDep=false
    var n = this.dep.includes(row.departement);
    if(n)
      this.firstDep=row.departement
    else {
      this.firstDep=this.dep[this.dep.length-1]
      this.autreDep=true
    }
    this.details=true
    this.editRow(row,true)
  }
  onEditSave(form: FormGroup) {
    let data=form.value
    let e=[]
    this.tabEse.value.forEach(id =>{
      if(id) e.push("/api/entreprises/"+id)
    });
    data.entreprises=e
    data.roles=[this.getRole(data.role,false)]
    //un mot de passe par defaut ajouter à PasswordEncoderSubscriber et le status
    console.log(data)
    this.adminServ.addUser(data).then(
      rep=>{
        this.showNotification('bg-success','Enregistré','bottom','center')
        this.closeEditModal.nativeElement.click();
        this.getUsers()
      },message=>{
        console.log(message)
        this.showNotification('bg-red',message,'bottom','right')
      }
    )
  }
  getRole(role,show=true){
    let r1='',r2=''
    if(role && (role=='Superviseur'||role[0]=="ROLE_Superviseur")){
      r1='Superviseur'
      r2="ROLE_Superviseur"
    }else if(role && (role=='Guest'||role[0]=="ROLE_Guest")){
      r1='Guest'
      r2="ROLE_Guest"
    }else if(role && (role=='Président du comité'||role[0]=="ROLE_PC")){
      r1='Président du comité'
      r2="ROLE_PC"
    }else if(role && (role=='Membre adjoint du comité'||role[0]=="ROLE_AC")){
      r1='Membre adjoint du comité'
      r2="ROLE_AC"
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
        this.adminServ.backupPWD(user.id).then(
          rep=>{
            this.showNotification('bg-success',"Mot de passe réinitialisé",'bottom','center')
            this.getUsers()
          },
          message=>this.showNotification('bg-red',message,'bottom','right')
        )
      }
    });
  }
}
export interface selectRowInterface {
  image: String;
  denomination: String;
  republique: String;
}
