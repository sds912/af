import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Injectable({
  providedIn: 'root'
})
export class PlaningService {

  constructor(private sharedService:SharedService) { }
  addAfectation(data){
    return this.sharedService.postElement(data,"/affectations/user")
  }
  getAffectations(params=""){
    return this.sharedService.getElement("/affectations"+params)
  }
  getTabLocAffectation(idInv){
    return this.sharedService.getElement("/affectations/localites/inventaire/"+idInv)
  }
}
