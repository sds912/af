import { DOCUMENT } from '@angular/common';
import { Component, Inject, ElementRef, OnInit, Renderer2, HostListener } from '@angular/core';
import { ROUTES } from './sidebar-items';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { InventaireService } from 'src/app/data/services/inventaire/inventaire.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ImmobilisationService } from 'src/app/data/services/immobilisation/immobilisation.service';

declare const Waves: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
  public sidebarItems: any[];
  showMenu: string = '';
  showSubMenu: string = '';
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  headerHeight = 60;

  imagePP=""
  fileToUploadPp:File=null;
  myRole=''
  dateInv=null
  inputMobilFile=null
  idCurrentEse=null
  countApprov=0
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    public sharedService:SharedService,//ici laisser à public à cause du html
    public securityServ:SecurityService,
    private _snackBar: MatSnackBar,
    private inventaireServ:InventaireService,
    private immoServ:ImmobilisationService,
    private router:Router
  ) {}
  @HostListener('window:resize', ['$event'])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }
  ngOnInit() {
    this.sidebarItems = ROUTES.filter(sidebarItem => sidebarItem);
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
    this.myRole=localStorage.getItem("roles")
    this.idCurrentEse = localStorage.getItem("currentEse")
    if(this.securityServ.isAuth){
      this.getCountImmoToApprovByEse()
    }
    this.immoServ.approvChange.subscribe(rep=>this.getCountImmoToApprovByEse());
    // setTimeout(() => {
    //   document.querySelectorAll('.menu-item').forEach((ele: HTMLElement) => {
    //     ele.style.background = 'none';
    //   });
    //   (document.querySelector('.menu-active').closest('.menu-item') as HTMLElement).style.background = 'radial-gradient(#EF7711, #774007)';
    // }, 1000);
  }
  isGranted(menu){
    let roles=menu.roles
    if(roles[0]=="all") return true
    let bool=false
    roles.forEach(element => {
      if(this.myRole && this.myRole.search(element)>=0 && (!this.securityServ.guest||this.guestAccessM(menu.id))){
        bool=true
      }
    });
    return bool
  }
  guestAccessM(id){
    let bool=false
    if(this.securityServ.guest && this.securityServ.user && this.securityServ.user.menu){
      bool=this.menuIsPick(id,this.securityServ.user.menu)
    }
    return bool
  }
  getIndexMenu(id,tab){
    let a=-1
    if(tab){//sinon erreur
      for(let i=0;i<tab.length;i++){
        if(tab[i] && tab[i][0] && tab[i][0]==id){
          a=i
          break
        };
      }
    }
    return a
  }
  menuIsPick(id,tab){
    return this.getIndexMenu(id,tab)> -1
  }
  isGrantedSubM(menu,i){
    let submenu=menu.submenu
    let roles=[]
    if(submenu && submenu[i] && submenu[i].roles && submenu[i].roles.length>0)roles=submenu[i].roles

    if(roles && (roles[0]=="all"||roles.length==0)) return true
    let bool=false
    roles.forEach(element => {
      if(this.myRole && this.myRole.search(element)>=0 && (!this.securityServ.guest||this.guestAccessSubM(menu.id,submenu[i].id))){
        bool=true
      }
    });
    return bool
  }
  guestAccessSubM(idMenu,idSub){
    let bool=false
    if(this.securityServ.guest && this.securityServ.user && this.securityServ.user.menu){
      bool=this.subMenuIsPick(idMenu,idSub,this.securityServ.user.menu)
    }
    return bool
  }
  subMenuIsPick(idMenu,idSub,tab){
    let indexMenu=this.getIndexMenu(idMenu,tab)
    let bool=false
    if(indexMenu>-1 && idSub){
      let tabSub=tab[indexMenu][1]
      bool=tabSub.indexOf(idSub)>-1
    }
    return bool
  }
  handleFileInputPP(file:FileList){
    this.fileToUploadPp=file.item(0);
    var reader=new FileReader();
    reader.onload=(event:any)=>{
      this.imagePP=event.target.result;
      this.changerPP();
    }
    reader.readAsDataURL(this.fileToUploadPp);
  }
  changerPP(){
    this.securityServ.updatePP(this.fileToUploadPp).then(
      rep=>{
        this.securityServ.getUser()
      },
      error=>this.imagePP=this.sharedService.baseUrl +"/images/"+this.securityServ.user?.image
    )
  }


  callMenuToggle(eleMenu: any, element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
    const isToggled = eleMenu.classList.contains('toggled');
    
    document.querySelectorAll('.ele-menu.toggled').forEach((ele: HTMLElement) => {
      ele.classList.remove('toggled');
    })

    if (!isToggled) {
      this.renderer.addClass(eleMenu, 'toggled');
    }
  }
  callSubMenuToggle(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }

  

  initLeftSidebar() {
    var _this = this;
    //Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
    // //Set Waves
    // Waves.attach(".menu .list a", ["waves-block"]);
    // Waves.init();
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    var height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }

  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover(e) {
    let body = this.elementRef.nativeElement.closest('body');

    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  mouseOut(e) {
    let body = this.elementRef.nativeElement.closest('body');

    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  showNotification(colorName, text, placementFrom, placementAlign,time=2000) {
    this._snackBar.open(text, '', {
      duration: time,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: [colorName,'color-white']
    });
  }
  exportForMobile(){
    this.securityServ.showLoadingIndicatior.next(true)
    this.inventaireServ.getDataForMobile(localStorage.getItem("currentEse")).then(
      rep=>{
        const blob = new Blob([JSON.stringify(rep)], {type : 'application/json'});
        saveAs(blob, 'mobile.json');
        this.securityServ.showLoadingIndicatior.next(false)
      },message=>{
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-red',message,'top','right')
      }
    )
  }
  importMobileFile(event){
    this.dateInv=null
    let selectedFile = event.target.files[0];
    this.inputMobilFile=null
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF-8");
    fileReader.onload = () => {
      const obj:string=typeof fileReader.result=="string"?fileReader.result:""
      this.saveData(JSON.parse(obj))
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }
  saveData(data){
    console.log(data);
    this.getInventaireById(data.inventaire.id,data)
  }
  getInventaireById(id,data){
    if(id){
      this.inventaireServ.getInventaireById(id).then(
        rep=>{
          this.thraitement(rep,data)
        },
        error=>{
          console.log(error);  
          this.showNotification('bg-red',"Fichier incorrect.",'top','center',5000)
        }
      )
      return ''
    }
    this.showNotification('bg-red',"Fichier incorrect.",'top','center',5000)
  }
  thraitement(rep,data){
    this.dateInv=rep.dateInv
    this.idCurrentEse = localStorage.getItem("currentEse")//laisser ici
    console.log(rep,this.idCurrentEse);
    if(rep.entreprise.id!=this.idCurrentEse){
      this.showNotification('bg-red',"Cet inventaire n'est pas rattaché à l'entité dans lequel vous êtes connecté.",'top','center',7000)
    }else if(rep.status=='close'){
      this.showNotification('bg-red',"Cet inventaire est déja cloturé.",'top','center',7000)
    }else{
      this.inventaireServ.sendMobileData(data).then(
        ()=>{
          this.showNotification('bg-success',"Enregistré",'top','center',5000)
          this.router.navigate(['/feuille/comptage/reload'])
        },error=>this.showNotification('bg-red',error,'top','center',5000)
      )
    }
  }
  async getCountImmoToApprovByEse(){
    this.countApprov = await this.immoServ.getCountImmoToApprovByEse(localStorage.getItem("currentEse"))    
  }
}
