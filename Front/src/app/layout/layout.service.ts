import { Injectable } from '@angular/core';
import { SharedService } from '../shared/service/shared.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private sharedService:SharedService) { }
  getNotifs(parametre=""){
    const id=localStorage.getItem("idUser")
    return this.sharedService.getElement("/userNotif?recepteur.id="+id+"&"+parametre)
  }
}
