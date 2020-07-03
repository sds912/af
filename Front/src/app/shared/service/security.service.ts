import { Injectable, Injector } from '@angular/core';
import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
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
  fonction=""
  securePwd=true
  
  jwtHelper = new JwtHelperService;
  login(data:any){
    return new Promise(
      (resolve, reject)=>{
      this.httpClient
        .post<any>(this.urlBack+"/login",data)
        .subscribe(
          (rep)=>{
            console.log(rep)
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
    localStorage.setItem('idUser', tokenDeco.id);
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
    }
  }
  logOut(){
    this.isAuth=false;
    this.SupAdmin=false;
    this.admin=false;
    this.superviseur=false;
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
      if(rep[2]==1){
        this.securePwd=false
      }
      console.log(rep)
    })
  }
  refreshToken(){
    let rt=""
    if(localStorage.getItem('refreshToken'))rt=localStorage.getItem('refreshToken')
    const data={refresh_token:rt}
    this.sharedService.postElement(data,"/token/refresh").then(rep=>{
      rep
      console.log(rep)
    })
  }
}
