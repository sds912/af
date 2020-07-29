import { Injectable, Injector } from '@angular/core';
import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import { ROUTES } from '../../layout/sidebar/sidebar-items';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  loading=false
  showLoadingIndicatior: Subject<boolean> = new Subject<boolean>();
  constructor(private injector:Injector,public httpClient: HttpClient,public router:Router) {
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
  guest=false
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
    }else if(roles.search("ROLE_Superviseur")>=0){
        this.superviseur=true;
        this.fonction="Superviseur";
    }else if(roles.search("ROLE_Guest")>=0){
        this.guest=true;
        this.fonction="Invité";
    }
  }
  logOut(){
    this.isAuth=false;
    this.SupAdmin=false;
    this.admin=false;
    this.superviseur=false;
    this.guest=false;
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
      if(this.user.entreprises.length==1){
        localStorage.setItem("currentEse",this.user.entreprises[0].id)
      }
      localStorage.setItem('idUser',this.user.id);
      if(rep[2]==1){
        this.securePwd=false
      }
      //console.log(rep)
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
}
