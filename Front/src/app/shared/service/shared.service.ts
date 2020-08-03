import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public baseUrl="http://127.0.0.1:8000"//image et autre
  //public baseUrl="https://a152836fa4c1.ngrok.io"
  public urlBack=this.baseUrl+'/api';
  public baseAsset="assets"
  constructor(public httpClient: HttpClient,public router:Router) { }
  capitalize(s){//Maj 1er lettre
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  decapitalize(s){//Maj 1er lettre
    if (typeof s !== 'string') return ''
    return s.charAt(0).toLowerCase() + s.slice(1)
  }
  getVariation(initial,final){
    if(initial==0) return 0
    let a=1
    if(initial<0)a=-1
    return ((final-initial)/initial)*a
  }
  trier(tab,param,ordre=1){//trie objet, si decroissant ordre=-1 ex: this.trier(clients,'nombre',-1)
    return tab.sort((a,b)=>{
      if (parseInt(a[param]) > parseInt(b[param])) return 1*ordre;
      else if (parseInt(b[param]) > parseInt(a[param])) return -1*ordre;
      return 0;
    })
  }
  trierData(tab,param,ordre=1){//trie objet, si decroissant ordre=-1 ex: this.trier(clients,'nombre',-1)
    return tab.sort((a,b)=>{
      if (new Date(a[param]) > new Date(b[param])) return 1*ordre;
      else if (new Date(b[param]) > new Date(a[param])) return -1*ordre;
      return 0;
    })
  }
  sansVirg(valeur){
    if(!valeur)valeur=0
    
    if(valeur=='0'||valeur=='0%'){
      valeur='-';
    }
    return valeur.replace(/ *\,/g,' ')
  }
  uniq(a, param){//ex: this.uniq(allClients,'nombre'); supprimer doublons nombres
    return a.filter(function(item, pos, array){
        return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
    })
  }
  decok(base,k){
    const rdm=parseInt(k.split("-")[2])
    const frst=this.tabAZ(rdm)
    const snd=this.tabAZ(rdm+2)
    const th=this.tabAZ(rdm+5)
    const n=(parseInt(k.split("-")[1])-parseInt(base.split("-")[1])-9999)/5
    const isValid=(parseInt(k.split("-")[3])-9)/3==parseInt(k.split("-")[1])
    if(frst+snd+th==k.split("-")[0] && Number.isInteger(n) && n>0 && isValid){
      return n
    }
    return ''
  }
  tabAZ(index){
    const tab=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    return tab[index]
  }
  tabMonth(n,t=true){
    let tab=['JANVIER','FEVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOUT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DECEMBRE']
    if(!t)tab=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octrobre','Novembre','Décembre']
    return tab[parseInt(n)-1]//car janvier c est 01 et son index 0 c à d 01-1
  }
  longText(valeur:string,limit){
    if(valeur && valeur.length>limit){
      return valeur.substring(0,limit)+"..."
    }
    return valeur
  }
  numStr(a, b) {
    a = '' + a;
    b = b || ' ';
    var c = '',
    d = 0;
    while (a.match(/^0[0-9]/)) {
      a = a.substr(1);
    }
    for (var i = a.length - 1; i >= 0; i--) {
      c = (d != 0 && d % 3 == 0) ? a[i] + b + c : a[i] + c;
      d++;
    }
    return c;
  }
  notNumb(x) {
    if (Number.isNaN(x)||isNaN(x)) {
      return true;
    }else{
      return false
    }
  }
  hashId(id){
    return id*52+179580387954682
  }
  decodId(id){
    return (id-179580387954682)/52
  }
  getWhithoutL0(compte){
    let n=compte
    while(n[n.length-1]=='0'){
      n=this.removeCharAtIndex(n.length,n)
    }
    return n
  }
  removeCharAtIndex(index, str) {//index commence par 1
    return str.substring(0, index - 1) + str.substring(index, str.length)
  }
  postElement(data:any,url:string){//return une promise
    return new Promise<any>(
      (resolve,reject)=>{
      this.httpClient
        .post<any>(this.urlBack+url,data).subscribe(
          rep=>{
            if(rep && rep[0] && rep[0].property_path){
              const err=this.errerForm(rep);
              reject(err)
            }else
              resolve(rep);
          },
          error=>{
            console.log(error);
            console.log(error.error);
            if(error && error.error && error.error.violations){
              const err=this.errerForm(error.error.violations);
              reject(err)
            }
            else
              reject(error.error.message);
          }
        );
    })
  }
  getElement(url:string){
    return new Promise<any>(
      (resolve,reject)=>{
      this.httpClient
        .get<any>(this.urlBack+url).subscribe(
          rep=>{
            resolve(rep);
          },
          error=>{
            console.log(error);
            console.log(error.error);
            if(error.error.status==404)
              this.router.navigate(["/404"])
            reject(error.error.message);
          }
        );
      })
  }
  putElement(data:any,url:string){//return une promise
    return new Promise<any>(
      (resolve,reject)=>{
      this.httpClient
        .put<any>(this.urlBack+url,data).subscribe(
          rep=>{
            if(rep && rep[0] && rep[0].property_path){
              const err=this.errerForm(rep);
              reject(err)
            }else
              resolve(rep);
          },
          error=>{
            console.log(error);
            console.log(error.error);
            if(error && error.error && error.error.violations){
              const err=this.errerForm(error.error.violations);
              reject(err)
            }
            else
              reject(error.error.message);
          }
        );
    })
  }
  deleteElement(url:string){
    return new Promise<any>(
      (resolve,reject)=>{
      this.httpClient
        .delete<any>(this.urlBack+url).subscribe(
          rep=>{
            resolve(rep);
          },
          error=>{
            console.log(error);
            console.log(error.error);
            if(error.error.status==404)
              this.router.navigate(["/404"])
            reject(error.error.message);
          }
        );
      })
  }
  getBlob(url: string): Observable<Blob> {
    return this.httpClient.get<Blob>(url, { observe: 'body', responseType: 'blob' as 'json',withCredentials:false })
  }
  errerForm(rep:any){
    var err='';
    for(var i=0;i<rep.length;i++){
      var vrg='';
      if(i>0) vrg=', ';
      err+=vrg+rep[i].message;
    }
    return err;
  }
  distinct=(value,index,self)=>{return self.indexOf(value)===index}//ex : tabContact=tabContact.filter(this.distinct)
}
