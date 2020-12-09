import { Injectable } from '@angular/core';
import { Entreprise } from 'src/app/data/schema/entreprise';
import { SharedService } from 'src/app/shared/service/shared.service';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  entreprises:Entreprise[]=[]
  
  constructor(private sharedService:SharedService) { }
  getEntreprise(){
    return this.sharedService.getElement("/entreprises")
  }
  getOneEntreprise(id){
    return this.sharedService.getElement("/entreprises/"+id)
  }
  addEntreprise(data){
    if(data.id==0){
      delete data.id;
      return this.sharedService.postElement(data,"/entreprises")
    }
    else
      return this.sharedService.putElement(data,"/entreprises/"+data.id)
  }
  getUsers(filters?: string) {
    let url = "/users";
    if (filters) {
      url += `?${filters}`;
    }
    return this.sharedService.getElement(url);
  }
  addUser(data){
    if(data.id==0) {
      delete data.id;
      return this.sharedService.postElement(data,"/users")
    }else{
      return this.sharedService.putElement(data,"/users/"+data.id)
    }
  }
  lockUser(id){
    return this.sharedService.getElement("/users/lock/"+id)
  }
  backupPWD(id){
    return this.sharedService.getElement("/users/back-up-pwd/"+id)
  }

}
