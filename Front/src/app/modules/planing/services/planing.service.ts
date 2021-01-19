import { TreeNode } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Injectable({
  providedIn: 'root'
})
export class PlaningService {

  constructor(private sharedService:SharedService,private http:HttpClient) { }
  addAfectation(data){
    return this.sharedService.postElement(data,"/affectations/user")
  }
  getAffectations(params=""){
    return this.sharedService.getElement("/affectations"+params)
  }
  getTabLocAffectation(idInv){
    return this.sharedService.getElement("/affectations/localites/inventaire/"+idInv)
  }
  getLocaliteParent(idLocalite){
    return this.sharedService.getElement("/parent/localite/"+idLocalite)
  }

 getLocalityByLevel(level: number, parent?: number) {
     let idCurrentEse = localStorage.getItem("currentEse");

     console.log(idCurrentEse);
    
     
    let url: string = '';
    if(parent !== undefined){
       url = `/localites?entreprise.id=${idCurrentEse}&level=${level}&parent=${parent}`;
    }else{
      url = `/localites?entreprise.id=${idCurrentEse}&level=${level}`;
    }

    return this.sharedService.getElement(url);


  }

  

}
