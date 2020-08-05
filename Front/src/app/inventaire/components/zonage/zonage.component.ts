import { Component, ElementRef, ViewChild, OnInit  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminService } from '../../../administration/service/admin.service';
import { InventaireService } from '../../service/inventaire.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';

export interface ChipColor {
  name: string;
  color: string;
}

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-zonage',
  templateUrl: './zonage.component.html',
  styleUrls: ['./zonage.component.sass']
})
export class ZonageComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Bureau 1','Bureau 2','Bureau 3','Bureau 4','Bureau 5','Bureau 6','Bureau 8','Bureau 9','Bureau X','Bureau Y','Bureau Z'];
  anelOpenState = false;
  step = 2;
  entreprises=[]
  idCurrentEse=''
  idCurrentLocal=0
  idCurrentZ=0
  currentLocal=null
  localites=[]
  allLoc=[]//surtout pour les positions
  localiteForm:FormGroup;
  tabSubdivision=new FormArray([]);
  subdivisions=[]
  tabOpen=[]
  update=false
  currentImage='map3.jpeg'//'font-maps.jpg'
  myId=""
  titleAdd=""
  @ViewChild('fruitInput', { static: true }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('closeLocaliteModal', { static: false }) closeLocaliteModal;
  @ViewChild('closeSubdivision', { static: false }) closeSubdivision;
  @ViewChild('formDirective1') private formDirective1: NgForm;
  @ViewChild('formDirective2') private formDirective2: NgForm;
  @ViewChild('formDirective3') private formDirective3: NgForm;
  availableColors: ChipColor[] = [
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' }
  ];
  constructor(private adminServ:AdminService,
              private inventaireServ:InventaireService,
              private fb: FormBuilder, 
              private _snackBar: MatSnackBar,
              private sharedService:SharedService,
              public securityServ:SecurityService) {
    this.titleAdd=this.securityServ.superviseurAdjoint?"Demandez au superviseur général d'ajouter une subdivision":"Ajouter une subdivision"
  }//revoir le delete sous-zone quand on ajout des user à ces sz
  ngOnInit() {
    this.myId=localStorage.getItem('idUser')
    this.carrousel()
    this.securityServ.showLoadingIndicatior.next(true)
    this.initForm()
    this.idCurrentEse=localStorage.getItem("currentEse")
    this.getOneEntreprise()
    this.addSubdivision("Localité")
  }
  initForm(localite={id:0,nom:'',position:[]}){
    if(this.formDirective1)this.formDirective1.resetForm()
    this.localiteForm = this.fb.group({
      id:[localite.id],
      nom: [localite.nom, [Validators.required]],
      position:[localite.position]
    });
  }
  getOneEntreprise(){
    this.adminServ.getOneEntreprise(this.idCurrentEse).then(
      rep=>{
        this.allLoc=rep.localites//les positions
        this.localites=rep.localites//all sauf adjoint
        if(this.securityServ.superviseurAdjoint)this.localites=this.allLoc.filter(loc=>loc.createur?.id==this.myId)
        this.subdivisions=rep.subdivisions
        if(this.tabOpen?.length==0)this.subdivisions?.forEach(sub=>this.tabOpen.push(0))//pour avoir un tableau qui a la taille des subdivisions
        this.securityServ.showLoadingIndicatior.next(false)
      },
      error=>{
        //this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  addLocalite(form: FormGroup){//les premieres subdivisions
    const firstL=this.localites.filter(l=>l.position?.length>0)
    if(firstL.length<=45){
      let data=form.value
      data.entreprise="/api/entreprises/"+this.idCurrentEse
      if(data.id==0)data.createur="/api/users/"+this.myId
      if(data.position && data.position.length==0)data.position=this.getPosition()
      this.securityServ.showLoadingIndicatior.next(true)
      console.log(data.position);
      this.inventaireServ.addLocalite(data).then(
        rep=>{
          this.securityServ.showLoadingIndicatior.next(false)
          this.closeLocaliteModal.nativeElement.click();
          if(data.id==0)this.localites.push(rep)//add
          else this.getOneEntreprise()//update
        },
        error=>{
          this.securityServ.showLoadingIndicatior.next(false)
          console.log(error)
        }
      )
    }else{
      Swal.fire({title: '',text: "Vous avez atteint le nombre limite de localité.",icon: 'info'})
    }
    
  }
  addSub(value,idParent){//l ajout des autres sub
    let data={nom:value,entreprise:"/api/entreprises/"+this.idCurrentEse,parent:"/api/localites/"+idParent,createur:"/api/users/"+this.myId}
    this.securityServ.showLoadingIndicatior.next(true)
    this.inventaireServ.addLocalite(data).then(
      rep=>{
        this.securityServ.showLoadingIndicatior.next(false)
        this.closeLocaliteModal.nativeElement.click();
        this.getOneEntreprise()//update
      },
      error=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  updateOne(form: FormGroup){//les update
    const data=form.value
    this.securityServ.showLoadingIndicatior.next(true)
    this.inventaireServ.addLocalite({id:data.id,nom:data.nom}).then(
      rep=>{
        this.update=false
        this.securityServ.showLoadingIndicatior.next(false)
        this.closeLocaliteModal.nativeElement.click();
        this.getOneEntreprise()
      },
      error=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      })
  }
  saveLocalite(form: FormGroup){
    if(!this.update) this.addLocalite(form)
    else this.updateOne(form) // le update de toutes
  }
  rev(tab){
    let t=[]
    if(tab && tab.length>0){
      t=tab
      this.sharedService.trier(t,'id',-1)
    }
    return t
  }
  add(event: MatChipInputEvent,idParent): void {
    const input = event.input;
    const value = event.value;

    // Add our sub
    if ((value || '').trim()) {
      const v=value.trim()
      if(v) this.addSub(value,idParent)
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }
  
  deleteLoc(localite){
    Swal.fire({
     title: 'Confirmation',
     text: "Voulez-vous confirmer la suppression de cet élément ?",
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Oui',
     cancelButtonText: 'Non'
   }).then(result => {
     if (result.value) {
       this.securityServ.showLoadingIndicatior.next(true)
       this.inventaireServ.deleteLoc(localite.id).then(
         rep=>{
           this.securityServ.showLoadingIndicatior.next(false)
           this.getOneEntreprise()
         },
         error=>{
           this.securityServ.showLoadingIndicatior.next(false)
           console.log(error)
         }
       )
     }
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
  longText(text,limit){
    return this.sharedService.longText(text,limit)
  }
  getPosition(){
    let arrond=false
    let l=2; 
    let t=2;
    do{
      arrond=false
      l=(Math.floor(Math.random() * 94) + 2); 
      t=(Math.floor(Math.random() * 83) + 2);
      this.allLoc.forEach(localite => {
        if(localite.position && localite.position.length>0){
          const left=this.getValPourcentage(localite.position[0])
          const top=this.getValPourcentage(localite.position[1])
          if(left==l && top==t||l>=(left-6) && l<=(left+6) && t>=(top-16) && t<=(top+16)){
            console.log("arrond",[left,top],[l,t])
            arrond=true
          }
        }
      });
    }while (arrond);
    return [l+'%',t+'%']
  }
  getValPourcentage(val){
    const valeur=parseInt(val.replace('%',''))
    return valeur
  }
  carrousel(){
    const images=['map4.jpg','map2.jpeg','map3.jpeg']
    let a=0
    window.setInterval(()=>{
      if(a>=images.length)a=0
      this.currentImage=images[a]
      a++
    },5000)
  }
  addSubdivision(nom=""){
    this.tabSubdivision.push(new FormControl(nom));
  }
  lowerCase(nom:string){
    return nom.toLowerCase()
  }
  capitalize(nom){
    return this.sharedService.capitalize(nom)
  }
  capitalizeAll(tab){
    let t=[]
    tab.forEach(element => {
      if(element.trim()) t.push(this.capitalize(element))
    });
    return t
  }
  oneSaveSubdiv(){
    let data={id:this.idCurrentEse,subdivisions:this.capitalizeAll(this.tabSubdivision.value)}
    this.adminServ.addEntreprise(data).then(
      rep=>{
        this.subdivisions=rep.subdivisions
        this.closeSubdivision.nativeElement.click();
        this.showNotification('bg-success',"Enregistré",'top','center')
      },
      message=>this.showNotification('bg-danger',message,'top','center')
    )
  }
  initSub(){
    this.tabSubdivision=new FormArray([]);
    this.subdivisions?.forEach(sub =>this.addSubdivision(sub));
    if(!this.subdivisions||this.subdivisions.length==0) this.addSubdivision("Localité")
  }
  firstSub(localites){
    return localites?.filter(loc=>loc.position?.length>0)
  }
  getCurrentSubById(id){
    let l= this.getOnById(id)?.subdivisions
    return l?l:[]
  }
  getOnById(id){
    let l= this.localites?.find(loc=>loc.id==id)
    return l?l:null
  }
  openFirst(id){
    this.idCurrentLocal=id
    this.tabOpen[0]=id
    this.offUnderSub(1)
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
  updateL(sub){
    this.update=true
    this.initForm(sub)
  }
}
