import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdminService } from '../../../administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { Entreprise } from '../../../administration/model/entreprise';
import Swal from 'sweetalert2';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as $ from 'jquery';
import { ROUTES } from '../../../layout/sidebar/sidebar-items';
import * as XLSX from 'xlsx';
type AOA = any[][];

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
  data_dii = [];
  colNmbre = 5
  selectedRowData: selectRowInterface;
  newUserImg = '';
  totalMessage = "Total"
  data = [];
  filteredData = [];
  editForm: FormGroup;
  selectedOption: string;
  dep = [
    'Direction financière',
    'Direction comptable',
    'Direction du patrimoine',
    'Autre (à préciser)'
  ]
  roles = [//si modifier modifier la fonction getRole ET roleChange et hiddenSuperviseur
    "Chef d'équipe de comptage",
    "Membre d'équipe de comptage",
    'Superviseur',
    'Superviseur général',
    'Superviseur adjoint',
    'Président du comité',
    'Membre du comité'
  ]
  sidebarItems: any[];
  show = false
  imgLink = ""
  image: string;
  defaultImag = "exemple.jpg";
  myId = ""
  tabEse = new FormArray([]);
  autreDep = false
  entreprises = []
  details = false
  update = false
  firstDep = ""//le premier input des departements
  localites = []
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  tabLoc = []
  idCurrentEse = 0//ne jamais utiliser pour une requête car elle peut etre egal à 0 si on selectionne toutes les entreprises c est juste pour les filtres des select
  idEseLocalStor = ""//utiliser celui là

  usersTampon = []
  isMembreEquipe = false
  isGuest = false
  tabMenu = []
  searchValue = ""
  subdivisions = []//leurs libelles
  tabOpen = []//les subdivisions ouvertes
  openLocalite = null;
  outUsers: [];
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private adminServ: AdminService, private sharedService: SharedService, public securityServ: SecurityService) {
    this.editForm = this.fb.group({
      id: [0],
      image: [''],
      username: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      poste: [''],
      departement: [''],
      status: ['actif'],
      role: ['', [Validators.required]]
    });
    this.imgLink = this.sharedService.baseUrl + "/images/"
    this.newUserImg = this.imgLink + this.defaultImag;
  }
  //ngif sur le bouton ajouter juste pour admin
  ngOnInit() {//si on recup les entreprise des users ne pas oublier de recup le getUser()
    this.securityServ.showLoadingIndicatior.next(true)
    this.myId = localStorage.getItem('idUser')
    this.idEseLocalStor = localStorage.getItem('currentEse')
    this.getUsers()
    this.getEntreprises()
    this.securityServ.getUser()
    this.sidebarItems = this.useInSideBI(ROUTES);
    this.outUsers = [];
  }
  useInSideBI(tab) {
    let objs = []
    tab.forEach(menu => {
      let subs = []
      if (menu.roles.indexOf('ROLE_Guest') > -1 || menu.roles.indexOf('all') > -1) {
        menu.submenu.forEach(subMenu => {
          if (subMenu.roles.indexOf('ROLE_Guest') > -1 || subMenu.roles.indexOf('all') > -1)
            subs.push({ id: subMenu.id, title: subMenu.title, submenu: [] })
        })
        objs.push({ id: menu.id, title: menu.title, submenu: subs })
      }
    });
    return objs
  }
  getEntrepriseById = () => this.securityServ.user?.entreprises?.find(e => e.id == this.idEseLocalStor);

  checkMenuChange(id) {
    var index = this.getIndexMenu(id);
    if (index > -1) {
      this.tabMenu.splice(index, 1);
    } else {
      this.tabMenu.push([id, []])
    }
  }
  getIndexMenu(id) {
    let a = -1
    if (this.tabMenu) {//sinon erreur
      for (let i = 0; i < this.tabMenu.length; i++) {
        if (this.tabMenu[i][0] == id) {
          a = i
          break
        };
      }
    }
    return a
  }
  menuIsPick(id) {
    return this.getIndexMenu(id) > -1
  }
  checksubMenuChange(idMenu, idSub) {
    let indexMenu = this.getIndexMenu(idMenu)//l index du menu
    if (indexMenu == -1) {//si on ne l a jamais coché
      this.tabMenu.push([idMenu, []])//on le coche
      indexMenu = this.tabMenu.length - 1 //ou this.getIndexMenu(id) //on recup son index
    }
    let tabSub = this.tabMenu[indexMenu][1]//on recup le tableau des sous menu
    var index = tabSub.indexOf(idSub);//on cherche l index de ce sous menu (passé en parametre)
    if (index > -1) {
      tabSub.splice(index, 1);//s il existe on l enleve
    } else {
      tabSub.push(idSub)//sinon on l ajout
    }
    this.tabMenu[indexMenu][1] = tabSub//on replace le tableau des sous menus à sa place
    if (tabSub && tabSub.length == 0) this.tabMenu.splice(indexMenu, 1)
  }
  subMenuIsPick(idMenu, idSub) {
    let indexMenu = this.getIndexMenu(idMenu)
    let bool = false
    if (indexMenu > -1) {
      let tabSub = this.tabMenu[indexMenu][1]
      bool = tabSub.indexOf(idSub) > -1
    }
    return bool
  }
  roleChange(role) {
    this.isMembreEquipe = false
    this.isGuest = false
    if (role == "Chef d'équipe" || role == "Chef d'équipe de comptage" ||
      role == "ROLE_CE" || role == "Membre d'équipe de comptage" || role == "Membre inventaire" || role == "ROLE_MI") {
      this.isMembreEquipe = true
    } else if (role == "Guest" || role == "ROLE_Guest") {
      this.isGuest = true
    }
  }
  initByRole() {
    this.tabLoc = []
    this.tabMenu = []
  }
  entiteChange(id) {
    if (id == 0) {
      this.setTableData(this.usersTampon)
      return
    }
    const currentEse = this.entreprises.find(e => e.id == id)
    const users = this.usersTampon.filter(u => u.entreprises.find(e => e.id == id))
    this.setTableData(users)
  }
  getUsers() {//voir doctrine/MyUser du Bac pour comprendre comment seul les users de l entreprise s affiche
    this.adminServ.getUsers().then(
      rep => {
        let users = []
        if (rep && rep.length > 0) {
          users = rep.reverse();
          users = users.filter(u => u.id != this.myId && u.roles && u.roles[0] != "ROLE_Admin")
        }
        this.setTableData(users);
        this.usersTampon = users

        this.show = true
        this.securityServ.showLoadingIndicatior.next(false)

        this.idCurrentEse = 0//les users de toutes les entreprises pour le chargement lorsqu'on fait une requête
        this.entiteChange(0)
        if (this.searchValue != "") this.filterDatatable(this.searchValue)//exemple si on cherche un user et on le bloque ne pas bougé
      },
      error => {
        console.log(error)
        this.securityServ.showLoadingIndicatior.next(false)
      }
    )
  }
  setTableData(data) {
    this.data = data;
    this.filteredData = data;
  }
  getEntreprises() {
    this.adminServ.getEntreprise().then(
      rep => {
        this.entreprises = rep
        if (rep && rep.length == 1) {
          this.idCurrentEse = rep[0].id//ne jamais utiliser pour une requête car elle peut etre egal à 0 si on selectionne toutes les entreprises c est juste pour les filtres des select
        }
        let entreprise = this.idEseLocalStor ? this.getEntreprise(this.idEseLocalStor) : null
        this.localites = entreprise?.localites//l admin n a pas besoin des localites
        if (this.securityServ.superviseurAdjoint) this.localites = this.localites.filter(loc => loc.createur?.id == this.myId)
        this.subdivisions = entreprise?.subdivisions ? entreprise?.subdivisions : []
        if (this.tabOpen?.length == 0) this.subdivisions?.forEach(sub => this.tabOpen.push(0))
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  getEntreprise(id) {
    let e = null
    if (this.entreprises && this.entreprises.length > 0 && id) e = this.entreprises.find(e => e.id == id)
    return e
  }
  getOneEntreprise(id) {
    this.adminServ.getOneEntreprise(id).then(
      rep => {
        this.localites = rep.localites
      },
      error => {
        //this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  addEntreprise(valeur = null) {
    this.tabEse.push(new FormControl(valeur));
  }
  depChange(dep) {
    this.autreDep = false
    this.editForm.get('departement').setValue("")
    if (dep != this.dep[this.dep.length - 1]) {
      this.editForm.get('departement').setValue(dep)
    } else {
      this.autreDep = true
    }
  }
  nomChange(nom) {
    if (!this.update) {
      console.log(nom)
     let u = nom.replace(/\ /g, "").replace(/\é/g, "e").replace(/\è/g, "e")
     this.editForm.get('username').setValue(u + '@gestion-immo.com')
    }
  }
  keyUpNomChange(nom: string) {
    this.adminServ.getUsers(`status=out&nom=${nom}`).then((rep: any) => {
      console.log(rep)
      this.outUsers = rep;
    });
  }
  selectOutUser(outUser) {
    this.update = true;
    this.editRow(outUser);
  }
  updateUser(user) {
    this.details = false
    this.autreDep = false
    this.tabMenu = []
    var n = this.dep.includes(user.departement);
    if (n)
      this.firstDep = user.departement
    else {
      this.firstDep = this.dep[this.dep.length - 1]
      this.autreDep = true
    }
    this.traitementUpdate(user)

    this.update = true
    this.editRow(user)
  }
  traitementUpdate(user) {
    this.roleChange(user.roles[0])
    this.tabEse = new FormArray([]);
    if (user.menu) this.tabMenu = user.menu
    user.entreprises.forEach(e => this.addEntreprise(e.id));
    this.tabLoc = []
    user.localites.forEach(l => this.checkLoc(l, true));
    this.tabOpen = []
    this.subdivisions?.forEach(sub => this.tabOpen.push(0))
  }
  editRow(row, lock = false) {
    if (this.formDirective) this.formDirective.resetForm()
    this.editForm = this.fb.group({
      id: [{ value: row.id, disabled: lock }],
      image: [{ value: row.image, disabled: lock }],
      username: [{ value: row.username, disabled: lock }, [Validators.required]],
      nom: [{ value: row.nom, disabled: lock }, [Validators.required]],
      poste: [{ value: row.poste, disabled: lock }],
      departement: [{ value: row.departement, disabled: lock }],
      status: ['actif'],
      role: [{ value: this.getRole(row.roles), disabled: lock }, [Validators.required]]
    });
    this.selectedRowData = row;
  }
  lockRow(user) {
    let mot = "débloqué"
    let mot2 = "déblocage"
    if (user.status == "actif") {
      mot = "bloqué"
      mot2 = "blocage"
    }
    Swal.fire({
      title: 'Confirmation',
      text: "Voulez-vous confirmer le " + mot2 + " de l'utilisateur " + user.nom + ' ?',
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
          rep => {
            this.securityServ.showLoadingIndicatior.next(false)
            this.showNotification('bg-success', 'Utilisateur ' + mot, 'top', 'center')
            this.getUsers()
          },
          message => {
            this.securityServ.showLoadingIndicatior.next(false)
            this.showNotification('bg-red', message, 'top', 'right')
          }
        )
      }
    });
  }
  longText(text, limit) {
    return this.sharedService.longText(text, limit)
  }
  addRow() {//pour l admin
    this.firstDep = ""
    this.details = false
    this.autreDep = false
    this.update = false
    this.isGuest = false
    this.isMembreEquipe = false
    this.tabEse = new FormArray([]);
    this.tabLoc = []
    let id = ""
    this.tabOpen = []
    this.subdivisions?.forEach(sub => this.tabOpen.push(0))
    if (this.entreprises && this.entreprises.length > 0) id = this.entreprises[0].id
    this.addEntreprise(id)//rempli l id si il y a une seule entreprise aussi
    let user = { id: 0, username: '', nom: '', poste: '', departement: '', role: '', image: this.defaultImag, status: 'actif' }
    this.editRow(user)
  }
  showDetails(row) {
    this.autreDep = false
    this.traitementUpdate(row)
    var n = this.dep.includes(row.departement);//si son departement est dans la liste
    if (n)
      this.firstDep = row.departement
    else {
      this.firstDep = this.dep[this.dep.length - 1]//autre dep
      this.autreDep = true
    }
    this.details = true
    this.editRow(row, true)
  }
  getDenomination(id) {
    let denomination = ""
    if (this.entreprises && this.entreprises.length > 0 && id) denomination = this.entreprises.find(e => e.id == id).denomination
    return denomination
  }
  onEditSave(form: FormGroup) {
    let data = form.value
    data.entreprises = this.getDataEse(data)
    data.currentEse = data.entreprises.length == 1 ? data.entreprises[0] : null//s'il est rattaché à une seule entité
    const role = this.getRole(data.role, false)
    data.roles = [role]
    data.menu = this.getDataMenu(role)//pour les Guest
    data.localites = this.getDataLoc()
    const changeSup = this.changeSuperviseur(data.role, data.id)
    if (!changeSup[0])
      this.sendData(data)
    else
      this.textChangeSup(data.role, changeSup)
  }
  sendData(data) {
    this.securityServ.showLoadingIndicatior.next(true)
    this.adminServ.addUser(data).then(
      rep => {
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-success', 'Enregistré', 'top', 'center')
        this.closeEditModal.nativeElement.click();
        this.getUsers()
        if (this.securityServ.admin) this.getEntreprises()//pour le hiddenSuperviseur quand un superviseur ajout un supeviseur
      }, message => {
        console.log(message)
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-red', message, 'top', 'right')
      }
    )
  }
  textChangeSup(role, data) {
    let message = "Vous ne pouvez pas crée un " + this.sharedService.decapitalize(role) + " car vous avez déja un " + data[2] + " dans l'entité " + data[1].denomination
    this.showNotification('bg-red', message, 'top', 'right', 7000)
  }
  getDataEse(data) {
    if (!this.securityServ.admin && data.id == 0) {
      return ["/api/entreprises/" + localStorage.getItem("idEse")]
    }
    let e = []
    this.tabEse.value.forEach(id => { if (id) e.push("/api/entreprises/" + id) });
    return e
  }
  getDataMenu(role) {
    if (role != 'ROLE_Guest') return []
    return this.tabMenu
  }
  getDataLoc() {
    let localites = []
    this.tabLoc.forEach(id => {
      if (id) localites.push("/api/localites/" + id)
    })
    return localites
  }
  getRole(role, show = true) {
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
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['bg-red']
    });
  }
  showNotification(colorName, text, placementFrom, placementAlign, duree = 2000) {
    this._snackBar.open(text, '', {
      duration: duree,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: [colorName, 'color-white']
    });
  }
  backupPwd(user) {
    Swal.fire({
      title: 'Confirmation',
      text: "Voulez-vous confirmer la réinitialisation du mot de passe de l'utilisateur " + user.nom + ' ?',
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
          rep => {
            this.securityServ.showLoadingIndicatior.next(false)
            this.showNotification('bg-success', "Mot de passe réinitialisé", 'top', 'center')
            this.getUsers()
          },
          message => {
            this.securityServ.showLoadingIndicatior.next(false)
            this.showNotification('bg-red', message, 'top', 'right')
          }
        )
      }
    });
  }
  rev(tab) {
    let t = []
    if (tab && tab.length > 0) {
      t = tab
      this.sharedService.trier(t, 'id', -1)
    }
    return t
  }
  inTabEse(valeur) {
    return this.tabEse.value.find(id => id == valeur);
  }
  trierSZ(sousZones) {
    return this.sharedService.trier(sousZones, 'id')
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
  openOther(i, id) {
    this.tabOpen[i] = id
    this.offUnderSub(i + 1)//les surdivisions en dessous
  }
  offUnderSub(j) {
    for (let i = j; i < this.tabOpen.length; i++) {
      if (this.tabOpen[i]) this.tabOpen[i] = 0
    }
  }
  openFirst(id) {
    this.openLocalite = id
    this.tabOpen[0] = id
    this.offUnderSub(1)
  }
  inTab(valeur, tab) {
    return tab?.find(id => id == valeur);
  }
  checkLoc(loc, addOnly = false) {
    var index = this.tabLoc.indexOf(loc.id);
    if (index > -1 && !addOnly) {
      this.tabLoc.splice(index, 1);
    } else if (index <= -1) {
      this.tabLoc.push(loc.id)
      const idParent = loc.idParent
      if (idParent && !this.inTab(idParent, this.tabLoc)) this.checkLoc(this.getOnById(idParent))//cocher les parents recursif
    }
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
  changeSuperviseur(role, idUserUpdate) {
    let change = [false, null, ""]
    const entreprises = this.tabEse.value
    entreprises.forEach(id => {
      const e = this.entreprises.find(ese => ese.id == id)
      const users = e?.users ? e.users : []
      const superviseurExist = users.find(u => u.roles[0] == "ROLE_Superviseur" && u.id != idUserUpdate) ? [true, "superviseur"] : false
      const supGeneExist = users.find(u => u.roles[0] == "ROLE_SuperViseurGene" && u.id != idUserUpdate) ? [true, "superviseur général"] : false
      const supAdjointExist = users.find(u => u.roles[0] == "ROLE_SuperViseurAdjoint" && u.id != idUserUpdate) ? [true, "superviseur adjoint"] : false
      if (superviseurExist[0] && (role == "Superviseur général" || role == "Superviseur adjoint") || (supGeneExist[0] || supAdjointExist[0]) && role == "Superviseur") {
        let n = superviseurExist[0] ? superviseurExist[1] : ""
        n = supAdjointExist[0] ? supAdjointExist[1] : n
        n = supGeneExist[0] ? supGeneExist[1] : n
        change = [true, e, n]
      }
    });
    return change
  }
  getAllAgents(evt: any) {

    const tabdii = [];

    console.log();


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
      this.data_dii = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }));


      for (let index = 1; index < this.data_dii.length; index++) {
        const element = this.data_dii[index];
        tabdii.push(element);
      }

      if (this.idCurrentEse == 0) {
        this.showNotification('bg-red', 'Selectionner Une Entité', 'top', 'center')

      } else {
        for await (const iterator of tabdii) {
          const obj = {
            id: 0,
            nom: iterator[0],
            entreprises: ["api/entreprises/" + this.idCurrentEse],
            username: iterator[3],
            poste: iterator[1],
            departement: iterator[2],
            password: "azerty",
            status: "OUT",
            image: "exemple.jpg"
          };
          // console.log(obj);
          this.securityServ.showLoadingIndicatior.next(true);
          this.adminServ.addUser(obj).then(rep => {
            // this.getUsers();
          });

        }
        this.securityServ.showLoadingIndicatior.next(false);
        this.showNotification('bg-success', 'Fichier Enregistré', 'top', 'center')
      }



      // console.log(this.data_dii);  



      // Verification

    };
    reader.readAsBinaryString(target.files[0]);
  }
}
export interface selectRowInterface {
  nom: string;
  image: string;
  denomination: string;
  republique: string;
}
