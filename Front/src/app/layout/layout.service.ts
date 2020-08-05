import { Injectable } from '@angular/core';
import { SharedService } from '../shared/service/shared.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private sharedService:SharedService) { }
  getNotifs(parametre=""){
    const id=localStorage.getItem("idUser")
    return this.sharedService.getElement("/user_notifs?type=notification&recepteur.id="+id+"&"+parametre)
  }
  lireNotification(id){
    return this.sharedService.putElement({status:"1"},"/user_notifs/"+id)
  }
  getCountNewNotifs(){
    return this.sharedService.getElement("/user_notis/count/new")
  }
}
