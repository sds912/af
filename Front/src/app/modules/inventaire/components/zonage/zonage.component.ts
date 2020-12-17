import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminService } from '../../../administration/service/admin.service';
import { InventaireService } from 'src/app/data/services/inventaire/inventaire.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { EntrepriseService } from 'src/app/data/services/entreprise/entreprise.service';
type AOA = any[][];

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
  isValableFileLocalite = true;
  localiteFile = [];
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Bureau 1', 'Bureau 2', 'Bureau 3', 'Bureau 4', 'Bureau 5', 'Bureau 6', 'Bureau 8', 'Bureau 9', 'Bureau X', 'Bureau Y', 'Bureau Z'];
  anelOpenState = false;
  step = 2;
  entreprises = []
  idCurrentEse = ''
  idCurrentLocal = 0
  idCurrentZ = 0
  currentLocal = null
  localites = []
  allLoc = []//surtout pour les positions
  localiteForm: FormGroup;
  tabSubdivision = new FormArray([]);
  subdivisions = []
  tabOpen = []
  update = false
  currentImage = 'mapdiidk1.jpg'//'font-maps.jpg'
  myId = ""
  titleAdd = ""
  idToOpen = 0
  displayedTabs = [];
  idTabs = [];
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

  data = [];
  constructor(private adminServ: AdminService,
    private inventaireServ: InventaireService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private sharedService: SharedService,
    public securityServ: SecurityService,
    private route: ActivatedRoute,
    public router: Router,
    private entrepriseService: EntrepriseService
  ) {
    this.titleAdd = this.securityServ.superviseurAdjoint ? "Demandez au superviseur général d'ajouter une subdivision" : "Ajouter une subdivision"
  }//revoir le delete sous-zone quand on ajout des user à ces sz
  ngOnInit() {
    this.myId = localStorage.getItem('idUser')
    this.carrousel()
    //@TODO::Supprimer la clone subdivision  dans le back.
    this.securityServ.showLoadingIndicatior.next(true)
    this.initForm();
    this.idCurrentEse = localStorage.getItem("currentEse")
    this.displayedTabs = [];
    this.idTabs = [];
    this.getOneEntreprise()
    this.addSubdivision("Localité")
    if(this.route.snapshot.params['id']){
      const id=this.route.snapshot.params['id']
      this.idToOpen=this.sharedService.decodId(+id)      
    }
    this.sameComponent()
  }

  sameComponent() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {//apres changement de la route
        if (this.route.snapshot.params['id']) {
          const id = this.route.snapshot.params['id']
          this.idToOpen = this.sharedService.decodId(+id)
          this.getOneEntreprise()//notif sup gene
        }
      }
    });
  }

  initForm(localite = { id: 0, nom: '', position: [], level: 0 }) {
    if (this.formDirective1) this.formDirective1.resetForm()
    this.localiteForm = this.fb.group({
      id: [localite.id],
      nom: [localite.nom, [Validators.required]],
      position: [localite.position],
      level: localite.level
    });
    console.log(localite);
  }

  getOneEntreprise() {
    this.adminServ.getOneEntreprise(this.idCurrentEse).then(
      rep=>{
        this.initLocalites();
        if(this.idToOpen && (this.securityServ.superviseurGene || this.securityServ.superviseur || 
          this.securityServ.superviseurAdjoint && this.allLoc.find(loc=>loc.id==this.idToOpen && loc.createur?.id==this.myId))){
          this.openOneById(this.idToOpen)
        }
        if(this.securityServ.superviseurAdjoint)this.localites=this.allLoc.filter(loc=>loc.createur?.id==this.myId)
        this.subdivisions=rep.subdivisions
        if(this.tabOpen?.length==0)this.subdivisions?.forEach(sub=>this.tabOpen.push(0))//pour avoir un tableau qui a la taille des subdivisions
        this.securityServ.showLoadingIndicatior.next(false)
      },
      error => {
        //this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }

  initLocalites() {
    this.inventaireServ.filterLocalites(this.idCurrentEse, 0, null).then((res) => {
      this.allLoc = res
      this.localites = res;
    });
  }

  addSubdivision(nom = "") {
    this.tabSubdivision.push(new FormControl(nom));
  }

  removeSubdivision(value: string) {
    this.tabSubdivision.removeAt(this.tabSubdivision.value.findIndex((nom: string) => nom === value));
  }

  oneSaveSubdiv() {
    let data = { id: this.idCurrentEse, subdivisions: this.capitalizeAll(this.tabSubdivision.value) }
    this.adminServ.addEntreprise(data).then(
      rep => {
        this.subdivisions = rep.subdivisions
        this.closeSubdivision.nativeElement.click();
        this.showNotification('bg-success', "Enregistré", 'top', 'center')
      },
      message => this.showNotification('bg-danger', message, 'top', 'center')
    )
  }

  initSub() {
    this.tabSubdivision = new FormArray([]);
    this.subdivisions?.forEach(sub => this.addSubdivision(sub));
    if (!this.subdivisions || this.subdivisions.length == 0) this.addSubdivision("Localité")
  }

  firstSub() {
    return this.localites?.filter((loc: any) => loc.level === 0)
  }

  addSub(value, idParent, level) {//l ajout des autres sub
    let data = { nom: value, entreprise: "/api/entreprises/" + this.idCurrentEse, parent: "/api/localites/" + idParent, level: level, createur: "/api/users/" + this.myId }
    this.securityServ.showLoadingIndicatior.next(true)
    this.inventaireServ.addLocalite(data).then(
      rep => {
        this.securityServ.showLoadingIndicatior.next(false)
        this.closeLocaliteModal.nativeElement.click();
        this.localites.push(rep);
        this.allLoc.push(rep);
        // this.getOneEntreprise()//update
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }

  addLocalite(form: FormGroup) {//les premieres subdivisions
    const firstL = this.allLoc.filter(l => l.position?.length > 0)
    const firstExist = this.firstSubNameExiste(this.allLoc, form.value)
    if (firstL.length <= 45 && !firstExist) {
      this.saveValideLoc(form)
    } else if (firstExist) {
      const here = this.firstSubNameExiste(this.localites, form.value)//si elle fais parties de celles que j ai créé
      let more = ""
      if (this.securityServ.superviseurAdjoint && !here) {//si superviseur adjoint et que c est pas ma localité
        more = ", veuillez contacter le superviseur général"
      }
      this.showNotification('bg-info', form.value.nom + " existe déja" + more + ".", 'bottom', 'center', 5000)
    } else {
      Swal.fire({ title: '', text: "Vous avez atteint le nombre limite de localité.", icon: 'info' })
    }
  }

  saveValideLoc(form) {
    let data = form.value
    data.entreprise = "/api/entreprises/" + this.idCurrentEse
    if (data.id == 0) data.createur = "/api/users/" + this.myId
    if (data.position && data.position.length == 0) data.position = this.getPosition()
    this.securityServ.showLoadingIndicatior.next(true)
    this.inventaireServ.addLocalite(data).then(
      rep => {
        this.securityServ.showLoadingIndicatior.next(false)
        this.closeLocaliteModal.nativeElement.click();
        this.localites.push(rep);
        this.allLoc.push(rep);
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }

  updateOne(form: FormGroup) {//les update
    const data = form.value
    this.securityServ.showLoadingIndicatior.next(true)
    this.inventaireServ.addLocalite({ id: data.id, nom: data.nom }).then(
      rep => {
        this.update = false
        this.securityServ.showLoadingIndicatior.next(false)
        this.closeLocaliteModal.nativeElement.click();
        // this.getOneEntreprise()
        const indexDeletedLocalite = this.localites.findIndex((ele: any) => ele.id == data.id);
        this.localites[indexDeletedLocalite] = rep;
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      })
  }

  onSubmit(form: FormGroup) {
    if (!this.update) {
      // form.controls['level'].setValue(0);
      this.addLocalite(form)
    } else {
      this.updateOne(form) // le update de toutes
    }
  }

  firstSubNameExiste(tab, localite) {
    const nom = localite.nom.trim()
    return tab.find(
      loc => loc.nom?.toLowerCase() == nom?.toLowerCase() &&
        loc.id != localite.id &&
        (
          loc.position?.length > 0 ||//si update first subdivison 
          localite.id == 0//si add first subdivison
        )
    ) != null
  }

  rev(tab) {
    let t = []
    if (tab && tab.length > 0) {
      t = tab
      this.sharedService.trier(t, 'id', -1)
    }
    return t
  }

  add(event: MatChipInputEvent, idParent, level): void {
    console.log('ee')
    const input = event.input;
    const value = event.value;
    const exist = this.localites.find(loc => loc.nom?.toLowerCase() == value.trim()?.toLowerCase() && loc.idParent == idParent && loc.level == level)
    // Add our sub
    if ((value || '').trim() && !exist) {
      const v = value.trim()
      if (v) this.addSub(value, idParent, level)
    } else if (exist) {
      this.showNotification('bg-info', value.trim() + " existe déja.", 'bottom', 'center', 5000)
      return
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  deleteLoc(localite) {
    if (localite.rattacher) {
      this.showNotification('bg-danger', "Impossible de supprimer cet élément car il contient des subdivisions.", 'bottom', 'center', 5000)
    }
    else if (localite.linkToUser) {
      this.showNotification('bg-danger', "Impossible de supprimer cet élément car des personnes y sont affectées.", 'bottom', 'center', 5000)
    }
    else if (!localite.linkToUser && !localite.rattacher) {
      this.supLocPossible(localite)
    }
  }

  supLocPossible(localite) {
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
          rep => {
            this.securityServ.showLoadingIndicatior.next(false)
            // this.getOneEntreprise()
            const indexDeletedLocalite = this.localites.findIndex((ele: any) => ele.id == localite.id);
            this.localites.splice(indexDeletedLocalite, 1);
          },
          error => {
            this.securityServ.showLoadingIndicatior.next(false)
            console.log(error)
          }
        )
      }
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign, duration = 2000) {
    this._snackBar.open(text, '', {
      duration: duration,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: [colorName, 'color-white']
    });
  }

  longText(text, limit) {
    return this.sharedService.longText(text, limit)
  }

  getPosition() {
    let arrond = false
    let l = 2;
    let t = 2;
    do {
      arrond = false
      l = (Math.floor(Math.random() * 94) + 2);
      t = (Math.floor(Math.random() * 83) + 2);
      this.allLoc.forEach(localite => {
        if (localite.position && localite.position.length > 0) {
          const left = this.getValPourcentage(localite.position[0])
          const top = this.getValPourcentage(localite.position[1])
          if (left == l && top == t || l >= (left - 6) && l <= (left + 6) && t >= (top - 16) && t <= (top + 16)) {
            arrond = true
          }
        }
      });
    } while (arrond);
    return [l + '%', t + '%']
  }

  getValPourcentage(val) {
    const valeur = parseInt(val.replace('%', ''))
    return valeur
  }

  // Carroussel and subdivisions
  carrousel() {
    const images = ['mapdiidk1.jpg', 'mapdiidk2.jpg', 'mapdiiabj1.jpg']
    let a = 0
    window.setInterval(() => {
      if (a >= images.length) a = 0
      this.currentImage = images[a]
      a++
    }, 5000)
  }

  lowerCase(nom: string) {
    return nom.toLowerCase()
  }

  capitalize(nom) {
    return this.sharedService.capitalize(nom)
  }

  capitalizeAll(tab) {
    let t = []
    tab.forEach(element => {
      if (element.trim()) t.push(this.capitalize(element))
    });
    return t
  }

  getOnById(id) {
    let l = this.localites?.find(loc => loc.id == id)
    return l ? l : null
  }

  getChildsLocalites(id: any, level: any, event?: any) {
    if (level == this.subdivisions.length) {
      return;
    }

    if (level == 1 && this.idCurrentLocal != id) {
      this.idCurrentLocal = id;
      this.displayedTabs = [];
    }

    const indexExistTab = this.displayedTabs.findIndex((ele: any) => ele.level == level);
    
    this.displayedTabs = this.displayedTabs.filter((ele: any) => ele.level <= level);

    this.inventaireServ.filterLocalites(this.idCurrentEse, level, id).then((res: any) => {
      if (indexExistTab > -1) {
        this.displayedTabs[indexExistTab] = {id: id, level: level};
      } else {
        this.displayedTabs.push({id: id, level: level});
      }

      if (res && res.length > 0 && this.idTabs.indexOf(id) == -1) {
        this.localites = this.localites.concat(res);
        this.allLoc = this.allLoc.concat(res);
        this.idTabs.push(id);
      }

      if (event) {
        const index = level - 1;
        document.querySelectorAll('.chip-localite-'+index).forEach((ele: HTMLElement) => ele.classList.remove('active'));
        (event.target as HTMLElement).closest('.chip-localite-'+index).classList.add('active');
      }
    });
  }

  filterByTab(tab: any) {
    return this.localites?.filter(loc => loc.idParent == tab.id && loc.level == tab.level);
  }

  updateL(sub) {
    this.update = true
    this.initForm(sub)
  }

  openOneById(id) {//on par de id et on recup tous ses parents
    this.tabOpen.push(id)
    this.tabOpen = []
    let idParent = null;
    let loc = this.allLoc.find(localite => localite.id == id)
    do {
      if (idParent) this.tabOpen.push(idParent) //si il y a un idParent on le pend et le dernier on prend son id ca sera le first
      idParent = loc ? loc.idParent : null
      loc = this.allLoc.find(localite => localite.id == idParent)
    } while (idParent)
    this.tabOpen.sort(function (a, b) { return a - b; });
    this.idCurrentLocal = this.tabOpen[0]
  }

  getAllLocalite(evt: any) {
    let fileList: FileList = evt.target.files;
    let fileUpload: File = fileList[0];
    const formData = new FormData();
    formData.append('file', fileUpload, fileUpload.name);
    formData.append('table', 'localites');
    formData.append('entreprise', this.idCurrentEse.toString());
    this.entrepriseService.importLocalites(formData).subscribe((response) => {
      this.showNotification('bg-info', response, 'top', 'center');
      window.location.reload();
    });
  }

  verfiIfDeuxLocIsSame(str1: string, str2: string) {
    if (str1 == str2) return true;
    return false;
  }

  isLastChilTab(b, c) {
    for (let index = 0; index < b.length - 1; index++) {
      const element = b[index];
      const el = c[index];

      if (el != element) {
        return index;
      }
    }
    return 100;
  }
}