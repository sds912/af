import { Injectable, Injector } from '@angular/core';
import { SharedService } from './shared.service';
import { AdministrationService } from './administration.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import { ROUTES } from '../../layout/sidebar/sidebar-items';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  public base="FA-5456" //l'identifiant de l'application heberger chez le client
  ne=null
  entiteRest=0
  activCle=false
  loading=false
  showLoadingIndicatior: Subject<boolean> = new Subject<boolean>();
  constructor(private injector:Injector,public httpClient: HttpClient,public router:Router, private administrationService: AdministrationService) {
    this.showLoadingIndicatior.subscribe((value) => {
      setTimeout(()=>this.loading = value,1)//pour eviter l erreur: Expression has changed after it was checked
    })
  }
  sharedService=this.injector.get(SharedService)
  urlBack=this.sharedService.urlBack
  user:any;
  token:string;
  isAuth=false;
  SupAdmin=false
  admin=false
  superviseur=false
  superviseurGene=false
  superviseurAdjoint=false
  guest=false
  chefEquipe=false
  membreInv=false
  fonction=""
  securePwd=true
  sidebarItems: any[];
  jwtHelper = new JwtHelperService;
  urlAfterConnexion="/dashboard/main"
  login(data:any){
    return new Promise(
      (resolve, reject)=>{
      this.httpClient
        .post<any>(this.urlBack+"/login",data)
        .subscribe(
          (rep)=>{
            this.traitementLogin(rep.token,rep.refresh_token);
            resolve();
          },
          (error)=>{
            reject(error);
          }
        );
      })
  }
  traitementLogin(token:any,refresh){
    this.isAuth=true;
    this.token=token;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refresh);
    const tokenDeco=this.jwtHelper.decodeToken(token);
    localStorage.setItem('username', tokenDeco.username);
    localStorage.setItem('roles', tokenDeco.roles);
    
    this.user={id:tokenDeco.id}
    this.getUser()
    this.setRole();
  }
  setRole(){
    const roles:string=localStorage.getItem("roles");
    if(roles.search("ROLE_SuperAdmin")>=0){
      this.SupAdmin=true;
      this.fonction="Super admin";
    }
    else if(roles.search("ROLE_Admin")>=0){
        this.admin=true;
        this.fonction="Admin";
    }
    else if(roles.search("ROLE_SuperViseurGene")>=0){
      this.superviseurGene=true;
      this.fonction="Superviseur général";
    }
    else if(roles.search("ROLE_SuperViseurAdjoint")>=0){
      this.superviseurAdjoint=true;
      this.fonction="Superviseur adjoint";
    }
    else if(roles.search("ROLE_Superviseur")>=0){
      this.superviseur=true;
      this.fonction="Superviseur";
    }
    else if(roles.search("ROLE_Guest")>=0){
        this.guest=true;
        this.fonction="Invité";
    }
    else if(roles.search("ROLE_CE")>=0){
      this.chefEquipe=true;
      this.fonction="Chef d'équipe de comptage";
    }
    else if(roles.search("ROLE_MI")>=0){
      this.membreInv=true;
      this.fonction="Membre d'équipe de comptage";
    }
  }
  logOut(){
    this.isAuth=false;
    this.SupAdmin=false;
    this.admin=false;
    this.superviseur=false;
    this.superviseurGene=false;
    this.superviseurAdjoint=false;
    this.guest=false;
    this.chefEquipe=false;
    this.membreInv=false;
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  load(){
    if(localStorage.getItem('token')){
      let token=localStorage.getItem('token');
      let refresh=localStorage.getItem('refreshToken')
      this.traitementLogin(token,refresh);
      //this.refreshToken()
    }
  }
  changePwd(data){
    //return this.sharedService.postElement(data,"/password")
    return this.sharedService.putElement(data,"/users/password/"+this.user.id)
  }
  changeInfo(data){
    return this.sharedService.putElement(data,"/users/info/"+this.user.id)
  }
  activKey(data){
    return this.sharedService.postElement(data,"/activeKey")
  }
  updateInfo(data){
    return this.sharedService.postElement(data,"/info")
  }
  updatePP(image){
    const formData:FormData=new FormData();
    formData.append('image',image)
    return this.sharedService.postElement(formData,"/update/pp")
  }
  getUser(){
    this.securePwd=true
    return this.sharedService.getElement("/info").then(rep=>{
      this.user=rep[0]
      if(this.user.entreprises?.length==1){
        localStorage.setItem("currentEse",this.user.entreprises[0].id)
      }
      localStorage.setItem('idUser',this.user.id);
      localStorage.setItem('mercureAuthorization',rep[1])
      if(rep[2]==1){
        this.securePwd=false
      }
      if (this.user.roles[0].search("ROLE_Admin")>=0) {
        this.getNE()//this.securePwd=false
      } 
    })
  }
  refreshToken(){
    let rt=""
    if(localStorage.getItem('refreshToken'))rt=localStorage.getItem('refreshToken')
    const data={refresh_token:rt}
    console.log(data)
    this.sharedService.postElement(data,"/token/refresh").then(rep=>{
      this.token=rep.token;
      localStorage.setItem('token', rep.token);
      localStorage.setItem('refreshToken', rep.refresh);
      console.log(rep)
    })
  }
  guestAccess(url){
    let idUrl = this.idByUrl(ROUTES,url);
    let access= this.getIdGuestRoute().indexOf(idUrl)>-1
    if(this.guest && !access && url!=this.urlAfterConnexion){
      this.logOut();
    }
  }
  getIdGuestRoute(){
    let ids=[]
    if(this.guest && this.user && this.user.menu){
      let menus=this.user.menu
      
      for(let i=0;i<menus.length;i++){
        ids.push(menus[i][0])//idMenu
        menus[i][1].forEach(idSub => ids.push(idSub));
      }
    }
    return ids
  }
  idByUrl(menus,url){
    let id=""
    for(let i=0;i<menus.length;i++){
      if(menus[i].path==url){
        id=menus[i].id
        break
      }
      menus[i].submenu.forEach(submenu => {
        if(submenu.path && submenu.path==url){
          id=submenu.id
        }
      });
    }
    return id
  }
  updateCurentEse(data){
    return this.sharedService.putElement(data,"/users/"+localStorage.getItem("idUser"))
  }
  async getNE(){
    let cree=0
    this.activCle=false
    if(this.user.entreprises){
      cree=this.user.entreprises.length
    }
    if(!this.user?.cle) {
      this.securePwd=true
      this.activCle=true
      return false;
    }
    // this.ne=this.sharedService.decok(this.base,this.user.cle)
    await this.administrationService.valideLicense(this.user.cle).then((res: any) => {
      if (res) {
        this.ne = res.split('-');
      }
    })
    this.entiteRest = this.ne[2] - cree;
    if(this.user && this.user.roles[0].search("ROLE_Admin")>=0 && (!this.user.cle||!this.ne)){
      this.securePwd=true//car l 'activation predomine sur le changement de mdp
      this.activCle=true  
    }
  }
  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    const data =  {refresh_token: localStorage.getItem('refreshToken')};
    return this.httpClient.post<any>(this.urlBack+"/token/refresh", data);
  }
}
