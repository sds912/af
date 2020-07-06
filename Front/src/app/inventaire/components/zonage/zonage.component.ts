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
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
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
  idCurrentEse=0
  idCurrentLocal=0
  idCurrentZ=0
  currentLocal=null
  localites=[]
  localiteForm:FormGroup;
  zoneForm:FormGroup;
  souZoneForm:FormGroup;
  @ViewChild('fruitInput', { static: true }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('closeLocaliteModal', { static: false }) closeLocaliteModal;
  @ViewChild('closeZoneModal', { static: false }) closeZoneModal;
  @ViewChild('closeSousZoneModal', { static: false }) closeSousZoneModal;

  constructor(private adminServ:AdminService,
              private inventaireServ:InventaireService,
              private fb: FormBuilder, 
              private _snackBar: MatSnackBar,
              private sharedService:SharedService,
              private securityServ:SecurityService) {
  }//revoir le delete sous zone quand on ajout des user à ces sz
  ngOnInit() {
    this.initForm()
    this.initForm2()
    this.initForm3()
    this.getEntreprise()
  }
  initForm(localite={id:0,nom:''}){
    this.localiteForm = this.fb.group({
      id:[localite.id],
      nom: [localite.nom, [Validators.required]]
    });
  }
  initForm2(zone={id:0,nom:''}){
    this.zoneForm = this.fb.group({
      id:[zone.id],
      nom: [zone.nom, [Validators.required]]
    });
  }
  initForm3(sousZone={id:0,nom:''}){
    this.souZoneForm = this.fb.group({
      id:[sousZone.id],
      nom: [sousZone.nom, [Validators.required]]
    });
  }
  updateLoc(localite){
    this.initForm(localite)
  }
  updateZone(zone){
    this.initForm2(zone)
  }
  getEntreprise(){
    this.adminServ.getEntreprise().then(
      rep=>{
        //this.securityServ.showLoadingIndicatior.next(false)
        let e=rep
        if(e && e.length>0){
          e=rep.reverse()
          this.idCurrentEse=e[0].id
          this.localites=rep[0].localites
        }
        this.entreprises=e
      },
      error=>{
        //this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  getOneEntreprise(){
    this.adminServ.getOneEntreprise(this.idCurrentEse).then(
      rep=>{
        console.log(rep)
        this.localites=rep.localites
      },
      error=>{
        //this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  pickLocalite(localite){
    this.idCurrentLocal=localite.id
    this.currentLocal=localite
  }
  getSousZone(zone){
    let tab=[]
    if(zone && zone.sousZones){
      let sousZones=zone.sousZones
      sousZones.forEach(sousZone =>tab.push(sousZone.nom));
    }
    return tab
  }
  addLocalite(form: FormGroup){
    let data=form.value
    data.entreprise="/api/entreprises/"+this.idCurrentEse
    this.securityServ.showLoadingIndicatior.next(true)
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
  }
  deleteLoc(localite){
     Swal.fire({
      title: 'Confirmation',
      text: "Voulez-vous confirmer la suppression de cette localité ?",
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
  deleteZone(zone){
     Swal.fire({
      title: 'Confirmation',
      text: "Voulez-vous confirmer la suppression de cette zone ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.value) {
        this.securityServ.showLoadingIndicatior.next(true)
        this.inventaireServ.deleteZone(zone.id).then(
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
  addZone(form: FormGroup){
    let data=form.value
    data.localite="/api/localites/"+ this.currentLocal.id
    this.securityServ.showLoadingIndicatior.next(true)
    this.inventaireServ.addZone(data).then(
      rep=>{
        this.securityServ.showLoadingIndicatior.next(false)
        this.closeZoneModal.nativeElement.click();
        this.getOneEntreprise()
      },
      error=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  updateSousZones(zone,sousZoneName){
    this.idCurrentZ=zone.id
    const sousZone=zone.sousZones.find(sz=>sz.nom==sousZoneName)
    this.initForm3(sousZone)
  }
  updateSZ(form: FormGroup){
    let data=form.value
    data.zone="/api/zones/"+this.idCurrentZ
    this.securityServ.showLoadingIndicatior.next(true)
    this.inventaireServ.addSousZone(data).then(
      rep=>{
        this.securityServ.showLoadingIndicatior.next(false)
        this.closeSousZoneModal.nativeElement.click();
        this.getOneEntreprise()
      },
      error=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  majZone(data){
     const entreprise=this.entreprises.find(id=>this.idCurrentEse)
     if(entreprise){
       const localites=entreprise.localites
      if(localites) {
         const localite=localites.find(id=>this.idCurrentLocal)
         if(localite){
           const idLoc=localite.id
           this.entreprises.find(id=>this.idCurrentEse).localites.find(id=>this.idCurrentLocal).push(data)
         }
      }
     }
  }
  addSousZone(value,zone){
    this.idCurrentZ=zone.id
    let data={ nom:value, zone:"/api/zones/"+this.idCurrentZ }
    this.securityServ.showLoadingIndicatior.next(true)
    this.inventaireServ.addSousZone(data).then(
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
  rev(tab){
    let t=[]
    if(tab && tab.length>0){
      t=tab
      this.sharedService.trier(t,'id',-1)
    }
    return t
  }

  add(event: MatChipInputEvent,zone): void {
    const input = event.input;
    const value = event.value;

    // Add our sous zone
    if ((value || '').trim()) {
      const v=value.trim()
      if(v) this.addSousZone(value,zone)
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(zone,sousZoneName: string): void {
    const sousZone=zone.sousZones.find(sz=>sz.nom==sousZoneName)
    this.idCurrentZ=zone.id
    Swal.fire({
      title: 'Confirmation',
      text: "Voulez-vous confirmer la suppression de cette sous zone ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.value) {
        this.securityServ.showLoadingIndicatior.next(true)
        this.inventaireServ.deleteSousZone(sousZone.id).then(
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
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
