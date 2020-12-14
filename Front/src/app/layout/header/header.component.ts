import { DOCUMENT } from '@angular/common';
import { Component, Inject, ElementRef, OnInit, Renderer2, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { RightSidebarService } from '../../services/rightsidebar.service';
import { WINDOW } from '../../services/window.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { LayoutService } from '../layout.service';
const document: any = window.document;
import { saveAs } from 'file-saver';
import { InventaireService } from 'src/app/data/services/inventaire/inventaire.service';
import { AdministrationService } from 'src/app/shared/service/administration.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  @ViewChild('roleTemplate', { static: true }) roleTemplate: TemplateRef<any>;
  @ViewChild('closePasswordModal', { static: false }) closePasswordModal;
  @ViewChild('openPasswordModal', { static: true }) openPasswordModal;
  @ViewChild('openKeyModal', { static: true }) openKeyModal;
  @ViewChild('openEseModal', { static: true }) openEseModal;
  @ViewChild('openNotif' , {static:true}) openNotif;

  @ViewChild('closeInfoModal', { static: false }) closeInfoModal;
  @ViewChild('closeEseModal', { static: false }) closeEseModal;
  @ViewChild('closeKeyModal', { static: false }) closeKeyModal;
  @ViewChild('formDirective') private formDirective: NgForm;
  @ViewChild('closeUnLockModal', { static: false }) closeUnLockModal;
  
  isNavbarShow: boolean;
  imagePP=""
  editForm: FormGroup;
  InfoForm: FormGroup;
  eseForm: FormGroup;
  showPwd=false
  showPwd2=false
  showPwd3=false
  errorConfPwd=false
  errorPwd=false
  updateInfo=false
  idEse=null
  notifs=[]
  imgLink=""
  countNotif=6
  paginateN=false
  news=0
  errorKey
  cle=null
  activCle=false
  localites=[]
  inventaires=[]
  loc= null
  inv= null
  showCode=false
  unLockCode=""
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private dataService: RightSidebarService,
    public sharedService:SharedService,//ici laisser à public à cause du html
    public securityServ:SecurityService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private layouteSev:LayoutService,
    private inventaireServ:InventaireService,
    private administrationService: AdministrationService
    ){
      
  }

  notifications: Object[] = [
    {
      userImg: 'assets/images/user/user1.jpg',
      userName: 'Sarah Smith',
      time: '14 mins ago',
      message: 'Please check your mail'
    },
    {
      userImg: 'assets/images/user/user2.jpg',
      userName: 'Airi Satou',
      time: '22 mins ago',
      message: 'Work Completed !!!'
    },
    {
      userImg: 'assets/images/user/user3.jpg',
      userName: 'John Doe',
      time: '3 hours ago',
      message: 'kindly help me for code.'
    },
    {
      userImg: 'assets/images/user/user4.jpg',
      userName: 'Ashton Cox',
      time: '5 hours ago',
      message: 'Lets break for lunch...'
    },
    {
      userImg: 'assets/images/user/user5.jpg',
      userName: 'Sarah Smith',
      time: '14 mins ago',
      message: 'Please check your mail'
    },
    {
      userImg: 'assets/images/user/user6.jpg',
      userName: 'Airi Satou',
      time: '22 mins ago',
      message: 'Work Completed !!!'
    },
    {
      userImg: 'assets/images/user/user7.jpg',
      userName: 'John Doe',
      time: '3 hours ago',
      message: 'kindly help me for code.'
    }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset =
      this.window.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop ||
      0;
    if (offset > 50) {
      this.isNavbarShow = true;
    } else {
      this.isNavbarShow = false;
    }
  }

  ngOnInit() {
    this.setStartupStyles();
    this.initForm()
    this.initForm3()    
    if(this.securityServ.isAuth){
      this.getCountNew()
      this.imgLink=this.sharedService.baseUrl +"/images/"
      this.getNotif()
      this.realTime('notification')
    }
    setTimeout(()=>{
      if(!this.securityServ.securePwd){
        this.openPasswordModal?.nativeElement.click()
      }
      if(!localStorage.getItem("currentEse") && !this.securityServ.admin){
        this.openEseModal?.nativeElement.click()
      }
      if(this.securityServ.activCle){
        this.openKeyModal?.nativeElement.click()
      }
    },1000);
  }

  getCode(){
    this.showCode=true
    this.unLockCode=this.codeK(this.inv+"-"+this.loc,1)
  }

  getLastLoc(localites){
    localites=localites.filter(loc=>loc.subdivisions.length==0)
    return localites
  }

  codeK(base,nmbr){//ne pas mettre dans shared car il ne doit pas faire partie des modules lors d'un deploiement
    const n=(parseInt(nmbr)*5+9999)+parseInt(base.split("-")[1])
    const rdm=Math.floor(Math.random()*20)
    const frst=this.sharedService.tabAZ(rdm)
    const snd=this.sharedService.tabAZ(rdm+2)
    const th=this.sharedService.tabAZ(rdm+5)
    return frst+snd+th+"-"+n+"-"+rdm+"-"+(n*4+17)
  }

  getInv(){
    const id=localStorage.getItem("currentEse")
    if(id && (this.securityServ.superviseur || this.securityServ.superviseurGene)){
      this.inventaireServ.getInventaireByEse(id).then(rep=>{
        this.inventaires=rep?.reverse()
        this.localites=this.inventaires?.length>0?this.inventaires[0].localites:[]
        this.inv=this.inventaires?.length>0?this.inventaires[0].id:null
      })
    }
  }

  invChange(idInv){
    const inventaire=this.inventaires.find(inv=>inv.id==idInv)
    this.localites=inventaire?inventaire.localites:[]
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

  showAllNotif(){
    this.paginateN=false
    this.getNotif()
  }
  lireNotif(id){
    this.layouteSev.lireNotification(id).then(()=>{
      this.notifs.find(notif=>notif.id==id).status=1
      this.news--
    })
  }
  getCountNew(){
    this.layouteSev.getCountNewNotifs().then(rep=>this.news=rep)
  }
  initForm(){
    this.editForm = this.fb.group({
      ancien: ['', [Validators.required]],
      password: ['', [Validators.required,Validators.minLength(6)]],
      confPassword: ['', [Validators.required,Validators.minLength(6)]]
    },
    {
      validator: this.mustMatch('password', 'confPassword')
    });
    if(this.formDirective)this.formDirective.resetForm()
  }
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            setTimeout(()=>matchingControl.setErrors({ mustMatch: true }),1)//pour eviter l erreur: Expression has changed after it was checked
        } else {
            matchingControl.setErrors(null);
        }
    }
  }
  updateInfos(){
    this.updateInfo=true
    this.initForm2()
  }
  initForm2(){
    let user=this.securityServ.user
    this.InfoForm = this.fb.group({
      nom: [user.nom, [Validators.required]],
      poste: [user.poste, [Validators.required]]
    });
  }
  initForm3(){
    this.idEse=localStorage.getItem("currentEse")?localStorage.getItem("currentEse"):""
    this.eseForm = this.fb.group({
      entreprise: [this.idEse, [Validators.required]]
    });
  }
  updatePwd(){
    this.errorConfPwd=false
    this.errorPwd=false
    this.initForm()
  }
  onSavePwd(form: FormGroup){
    let d=form.value
    let data={
      ancien:d.ancien,
      newPassword:d.password,//car si on met nouveau api plat form le modifie directement
      confPassword:d.confPassword
    }
    this.errorConfPwd=false
    this.errorPwd=false
    this.securityServ.showLoadingIndicatior.next(true)
    this.securityServ.changePwd(data).then(
      rep=>{
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-success','Mot de passe modifié','top','center')
        this.closePasswordModal.nativeElement.click();
        this.securityServ.securePwd=true
      },message=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(message)
        this.errorPwd=true
        form.controls["ancien"].setErrors({ ancienMdp: true })
        this.showNotification('bg-red',message,'top','right')
      }
    )    
  }
  onSaveInfo(form: FormGroup){
    let data=form.value
    this.securityServ.showLoadingIndicatior.next(true)
    this.securityServ.changeInfo(data).then(
      rep=>{
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-success',"Enregistrer",'top','center')
        this.securityServ.user.nom=data.nom
        this.securityServ.user.poste=data.poste
        this.closeInfoModal.nativeElement.click();
      },message=>{
        console.log(message)
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-red',message,'top','right')
      }
    ) 
  }
  onSaveEse(form: FormGroup){
    this.securityServ.showLoadingIndicatior.next(true)
    const id=form.value.entreprise
    const data={currentEse:"/api/entreprises/"+id}
    this.securityServ.updateCurentEse(data).then(
      rep=>{
        this.securityServ.showLoadingIndicatior.next(false)
        this.securityServ.user.currentEse=rep.currentEse
        //this.showNotification('bg-success',"Enregistrer",'top','center')
        this.closeEseModal.nativeElement.click();
        localStorage.setItem("currentEse",id)
        setTimeout(()=>{window.location.reload()},1000);
      },message=>{
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-red',message,'top','right')
      }
    )
  }

  showNotification(colorName, text, placementFrom, placementAlign,duration=2000) {
    this._snackBar.open(text, '', {
      duration: duration,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: [colorName,'color-white']
    });
  }

  setStartupStyles() {
    //set theme on startup
    if (localStorage.getItem('theme')) {
      this.renderer.removeClass(this.document.body, 'dark');
      this.renderer.removeClass(this.document.body, 'light');
      this.renderer.addClass(this.document.body, localStorage.getItem('theme'));
    } else {
      this.renderer.addClass(this.document.body, 'light');
    }

    // set light sidebar menu on startup
    if (localStorage.getItem('menu_option')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('menu_option')
      );
    } else {
      this.renderer.addClass(this.document.body, 'menu_light');
    }

    // set logo color on startup
    if (localStorage.getItem('choose_logoheader')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('choose_logoheader')
      );
    } else {
      this.renderer.addClass(this.document.body, 'logo-white');
    }
  }

  callFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  mobileMenuSidebarOpen(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  public toggleRightSidebar(): void {
    this.dataService.changeMsg(
      (this.dataService.currentStatus._isScalar = !this.dataService
        .currentStatus._isScalar)
    );
  }
  logOut(){
    this.securityServ.logOut()
  }
  getEntite(){
    const idEse=localStorage.getItem("currentEse")?localStorage.getItem("currentEse"):""
    return this.securityServ.user?.entreprises?.find(e=>e.id==idEse)
  }
  realTime(type){
    setTimeout(() => {//on attend 10 secondes le temps que le mercureAuthorization soit recupéré et stocké dans le localstorage
      const url = new URL('http://localhost:3000/.well-known/mercure')
      url.searchParams.append('topic', 'http://asma-gestion-immo.com/'+type)
      const mercureAuthorization=localStorage.getItem('mercureAuthorization')
      const eventSource = new EventSourcePolyfill(url.toString(), {headers: {Authorization: mercureAuthorization} });
      eventSource.onmessage = e => {
        if(type=="notification") {
          this.getNotif()
          this.getCountNew()
        }
      };
    }, 10000);
  }
  getNotif(){
    const params="pagination="+this.paginateN+"&count="+this.countNotif+"&order[id]=desc"
    this.layouteSev.getNotifs(params).then(
      rep=>{
        this.notifs=rep
      },
      message=>{
        console.log(message)
      }
    )
  }
  onSubmitCle(){
    this.errorKey=true
    // const deco=this.sharedService.decok(this.securityServ.base,this.cle)
    this.administrationService.valideLicense(this.cle).then((res: any) => {
      if(res){
        let deco = res.split('-');
        this.errorKey=false
        this.securityServ.showLoadingIndicatior.next(true);
        const data={nombre:+deco[2],cle:this.cle}
        this.securityServ.activKey(data).then(
          rep=>{
            //this.closeModal()
            this.securityServ.showLoadingIndicatior.next(false);
            this.showNotification('bg-success',rep.message,'top','center',5000)
            this.closeKeyModal.nativeElement.click();
            setTimeout(()=>window.location.reload(),6000)
          },
          message=>{
            this.securityServ.showLoadingIndicatior.next(false);
            this.showNotification('bg-danger',message,'top','center')
          }
        )    
      }
      else{
        this.showNotification('bg-danger','Clé non valide','bottom','center')
      }
    })
  }
  activNewKey(){
    this.activCle=true
    this.cle=null
  }
}
