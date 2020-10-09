import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';
@Injectable({
  providedIn: 'root'
})
export class ImmobilisationService {

  constructor(private sharedService:SharedService) { }

  getAllImmosByEntreprise(id){
    return this.sharedService.getElement("/immobilisations?entreprise.id="+id);
  }

  getAllInventaire() {
    return this.sharedService.getElement("/inventaires");
  }

  postImmobilisation(data : any) {  
    if(data.id && data.id!=0){
      return this.sharedService.putElement(data,"/immobilisations/"+data.id)
    }
    delete data.id;
    return this.sharedService.postElement(data,"/immobilisations")
  }

  approveAjustement(id,value){
    return this.sharedService.getElement(`/approuve/ajustement/${id}/${value}`);
  }

  getImmobilisationByInventaire(id,params='') {
    return this.sharedService.getElement(`/immobilisations?inventaire.id=${id}&${params}`);
  }

  deleteImmoByInventaire(id) {
    return this.sharedService.deleteElement('/immobilisations/'+id);
  }
}
 