import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/shared/service/shared.service';
@Injectable({
  providedIn: 'root'
})
export class ImmobilisationService {
  approvChange: Subject<boolean> = new Subject<boolean>();
  constructor(private sharedService:SharedService) { }

  getAllImmosByEntreprise(entreprise: number, inventaire: number, page?: number, count = 10, filters = ''){
    return this.sharedService.getElement(`/immobilisations?entreprise.id=${entreprise}&inventaire.id=${inventaire}${filters}&pagination=true&page=${page}&count=${count}`);
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

  getCountImmoToApprovByEse(id) {
    return this.sharedService.getElement(`/approuve/waitting/${id}`);
  }

  deleteImmoByInventaire(id) {
    return this.sharedService.getElement(`/immobilisations/delete/${id}/inventaire`);
  }

  deleteImmoByEntreprise(id) {
    return this.sharedService.getElement(`/immobilisations/delete/${id}/entreprise`);
  }
}
 