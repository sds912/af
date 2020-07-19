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
  idPresiComite=0
  instructions=[]
  docsPv=[]
  docsDc=[]
  tabComite=new FormArray([]);
  tabPresents=new FormArray([]);
  tabOtherPresent=new FormArray([]);
  tabLocalite=new FormArray([]);
  presidents=[]
  membresComite=[]
  users=[]
  myId=""
  entreprises:Entreprise[]=[]
  localites=[]
  idCurrentEse=0
  showForm=false//remettre à false
  
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
    this.tabLocalite=new FormArray([]);
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
    this.tabPresents=new FormArray([]);
    inventaire.presentsReunion.forEach(membre => this.addPresentMembre(membre.id));
    this.tabOtherPresent=new FormArray([]);
    inventaire.presentsReunionOut.forEach(nom => this.addOtherPres(nom));
    this.tabLocalite=new FormArray([]);
    inventaire.localites.forEach(localite => this.addLocalite(localite.id));
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
    data.decisionCC=this.getOnlyFile(this.docsDc)
    data.presiComite=this.idPresiComite
    data.membresCom=this.tabComite.value
    data.presentsReunion=this.tabPresents.value
    data.presentsReunionOut=this.tabOtherPresent.value
    data.pvReunion=this.getOnlyFile(this.docsPv)
    data.entreprise=this.idCurrentEse
    data.localites=this.tabLocalite.value
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
  addLocalite(valeur=0){
    this.tabLocalite.push(new FormControl(valeur));
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
    if(this.tabLocalite.length==0)this.addLocalite()
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
}
