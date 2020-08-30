import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Injectable({
  providedIn: 'root'
})
export class PlaningService {

  constructor(private sharedService:SharedService) { }
  addAfectation(data){
    if(data.id && data.id!=0){
      return this.sharedService.putElement(data,"/affectations/"+data.id)
    }
    delete data.id;
    return this.sharedService.postElement(data,"/affectations")
  }
  getAffectations(params=""){
    return this.sharedService.getElement("/affectations"+params)
  }
  getTabLocAffectation(idInv){
    return this.sharedService.getElement("/affectations/localites/invemtaire/"+idInv)
  }
}
