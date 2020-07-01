import { DOCUMENT } from '@angular/common';
import { Component, Inject, ElementRef, OnInit, Renderer2, HostListener } from '@angular/core';
import { ROUTES } from './sidebar-items';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';

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
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    public sharedService:SharedService,//ici laisser à public à cause du html
    public securityServ:SecurityService

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
  }
  isGranted(roles){
    if(roles[0]=="all") return true
    let bool=false
    roles.forEach(element => {
      if(this.myRole && this.myRole.search(roles)>=0){
        bool=true
      }
    });
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
      rep=>{},
      error=>this.imagePP=this.sharedService.baseUrl +"/images/"+this.securityServ.user?.image
    )
  }


  callMenuToggle(event: any, element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
    const hasClass = event.target.classList.contains('toggled');
    if (hasClass) {
      this.renderer.removeClass(event.target, 'toggled');
    } else {
      this.renderer.addClass(event.target, 'toggled');
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
}
