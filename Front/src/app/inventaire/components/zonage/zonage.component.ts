import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as XLSX from 'xlsx';
import { isThisQuarter } from 'date-fns';
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

  // Modif by dii

  data = [];
  constructor(private adminServ: AdminService,
    private inventaireServ: InventaireService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private sharedService: SharedService,
    public securityServ: SecurityService,
    private route: ActivatedRoute,
    public router: Router) {
    this.titleAdd = this.securityServ.superviseurAdjoint ? "Demandez au superviseur général d'ajouter une subdivision" : "Ajouter une subdivision"
  }//revoir le delete sous-zone quand on ajout des user à ces sz
  ngOnInit() {
    this.myId = localStorage.getItem('idUser')
    this.carrousel()
    this.securityServ.showLoadingIndicatior.next(true)
    this.initForm()
    this.idCurrentEse = localStorage.getItem("currentEse")
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
  initForm(localite = { id: 0, nom: '', position: [] }) {
    if (this.formDirective1) this.formDirective1.resetForm()
    this.localiteForm = this.fb.group({
      id: [localite.id],
      nom: [localite.nom, [Validators.required]],
      position: [localite.position],
      level: []
    });
  }
  getOneEntreprise() {
    this.adminServ.getOneEntreprise(this.idCurrentEse).then(
      rep=>{
        this.allLoc=rep.localites//les positions
        this.localites=rep.localites//all sauf adjoint
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
        if (data.id == 0) this.localites.push(rep)//add
        else this.getOneEntreprise()//update
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  addSub(value, idParent, level) {//l ajout des autres sub
    let data = { nom: value, entreprise: "/api/entreprises/" + this.idCurrentEse, parent: "/api/localites/" + idParent, level: level, createur: "/api/users/" + this.myId }
    this.securityServ.showLoadingIndicatior.next(true)
    this.inventaireServ.addLocalite(data).then(
      rep => {
        this.securityServ.showLoadingIndicatior.next(false)
        this.closeLocaliteModal.nativeElement.click();
        this.getOneEntreprise()//update
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
        this.getOneEntreprise()
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      })
  }
  onSubmit(form: FormGroup) {
    if (!this.update) {
      form.controls['level'].setValue(0);
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
    const input = event.input;
    const value = event.value;
    const exist = this.localites.find(loc => loc.nom?.toLowerCase() == value.trim()?.toLowerCase() && loc.idParent == idParent)
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
            this.getOneEntreprise()
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
  carrousel() {
    const images = ['mapdiidk1.jpg', 'mapdiidk2.jpg', 'mapdiiabj1.jpg']
    let a = 0
    window.setInterval(() => {
      if (a >= images.length) a = 0
      this.currentImage = images[a]
      a++
    }, 5000)
  }
  addSubdivision(nom = "") {
    this.tabSubdivision.push(new FormControl(nom));
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
  firstSub(localites) {
    return localites?.filter(loc => loc.position?.length > 0)
  }
  getCurrentSubById(id) {
    let l = this.getOnById(id)?.subdivisions
    return l ? l : []
  }
  getOnById(id) {
    let l = this.localites?.find(loc => loc.id == id)
    return l ? l : null
  }
  openFirst(id) {
    this.idCurrentLocal = id
    this.tabOpen[0] = id
    this.offUnderSub(1)
  }
  openOther(e: Event, i, id) {
    this.tabOpen[i] = id
    this.offUnderSub(i + 1); //les surdivisions en dessous
    document.querySelectorAll('.chip-localite-'+i).forEach((ele: HTMLElement) => {
      ele.classList.remove('active');
    });
    (e.target as HTMLElement).closest('.chip-localite-'+i).classList.add('active');
  }
  offUnderSub(j) {
    for (let i = j; i < this.tabOpen.length; i++) {
      if (this.tabOpen[i]) this.tabOpen[i] = 0
    }
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

    // console.log('this.subdivisions.length => ', this.subdivisions.length);

    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      /* read workbook */

      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = await <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }));

      console.log(this.data);

      for (let index = 1; index < this.data.length; index++) {
        const element = this.data[index];
        this.localiteFile.push(element);
      }


      for (let index = 0; index < this.localiteFile.length; index++) {
        const element = this.localiteFile[index];

        if (element.length > this.subdivisions.length) {
          this.isValableFileLocalite = false;
        }
      }

      if (this.isValableFileLocalite) {
        let il = 1 ;
        for await (const iterator of this.localiteFile) {
          il++ ;
          const element = iterator;
          
          let lastId = 0;

          for (let i = 0; i < element.length; i++) {
            const el = element[i];

            if (i == 0) {
            await  this.inventaireServ.addLocalite({
                nom: el,
                entreprise: "/api/entreprises/" + this.idCurrentEse,
                createur: "/api/users/" + this.myId,
                level: i,
                position: this.getPosition(),
                // lastLevel: i == element.length
              }).then(rep => {
                lastId = rep.id ;
                this.securityServ.showLoadingIndicatior.next(true)
                console.log(rep);
              });
            } else {
             await  this.inventaireServ.addLocalite({
                nom: el,
                entreprise: "/api/entreprises/" + this.idCurrentEse,
                createur: "/api/users/" + this.myId,
                level: i,
                parent: "/api/localites/" + lastId,
                // lastLevel: i == element.length
              }).then(rep => {
                lastId = rep.id;
                this.securityServ.showLoadingIndicatior.next(true)
                console.log(rep);
                
              });
            }
          }
        }
        this.getOneEntreprise();
        this.securityServ.showLoadingIndicatior.next(false);
        // console.log(this.localiteFile);

      } else {
        this.showNotification('bg-red', 'Fichier uploader pa bon', 'top', 'center')
      }


    };
    reader.readAsBinaryString(target.files[0]);

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

 // this.inventaireServ.addLocalite({
            //   nom: el,
            //   entreprise: "/api/entreprises/" + this.idCurrentEse,
            //   createur: "/api/users/" + this.myId,
            //   level : i ,
            //   position: i==0 ? this.getPosition() : "",
            //   lastLevel : i == element.length ,
            // }).then(rep => {
            //   this.inventaireServ.addLocalite({
            //     nom: element[i+1],
            //     entreprise: "/api/entreprises/" + this.idCurrentEse,
            //     createur: "/api/users/" + this.myId,
            //     level : i ,
            //     parent: "/api/localites/" +rep.id,
            //     lastLevel : i == element.length
            //   });
            // });

// console.log(this.verfiIfDeuxLocIsSame(element[0],element_suivant[0]));







          // if (this.verfiIfDeuxLocIsSame(element[0], element_precedent[0])) {

          // } else {
          //   const obj = {
          //     nom: element[0],
          //     entreprise: "/api/entreprises/" + this.idCurrentEse,
          //     createur: "/api/users/" + this.myId,
          //     position: this.getPosition()

          //   };
          //   this.inventaireServ.addLocalite(obj).then(rep => {

          //     if (rep.id>0) {
          //       const obj = {
          //         nom: element[1],
          //         entreprise: "/api/entreprises/" + this.idCurrentEse,
          //         createur: "/api/users/" + this.myId,
          //         parent: "/api/localites/" + rep.id
          //         // position: this.getPosition()

          //       };
          //       this.inventaireServ.addLocalite(obj).then(rep1 => {
          //         if (rep1.id > 0) {
          //           const obj = {
          //             nom: element[2],
          //             entreprise: "/api/entreprises/" + this.idCurrentEse,
          //             createur: "/api/users/" + this.myId,
          //             parent: "/api/localites/" + rep1.id
          //             // position: this.getPosition()

          //           };
          //           this.inventaireServ.addLocalite(obj).then(rep2 => {
          //             if (rep2.id > 0) {
          //               const obj = {
          //                 nom: element[3],
          //                 entreprise: "/api/entreprises/" + this.idCurrentEse,
          //                 createur: "/api/users/" + this.myId,
          //                 parent: "/api/localites/" + rep2.id
          //                 // position: this.getPosition()

          //               };
          //               this.inventaireServ.addLocalite(obj).then(rep3 => {
          //                 console.log(rep3);

          //               });
          //             }

          //           });
          //         }
          //       });
          //     }else {
          //       console.log('not bon');

          //     }


          //   });
          // }