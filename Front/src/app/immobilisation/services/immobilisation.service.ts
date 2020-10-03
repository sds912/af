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
    return this.sharedService.postElement(data , "/immobilisations");
  }

  getImmobilisationByInventaire(id,params='') {
    return this.sharedService.getElement(`/immobilisations?inventaire.id=${id}&${params}`);
  }

  deleteImmoByInventaire(id) {
    return this.sharedService.deleteElement('/immobilisations/'+id);
  }
}
 