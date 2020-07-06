import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Injectable({
  providedIn: 'root'
})
export class InventaireService {

  constructor(private sharedService:SharedService) { }
  addLocalite(data){
    if(data.id && data.id!=0){
      return this.sharedService.putElement(data,"/localites/"+data.id)
    }
    delete data.id;
    return this.sharedService.postElement(data,"/localites")
  }
  addZone(data){
    if(data.id && data.id!=0){
      return this.sharedService.putElement(data,"/zones/"+data.id)
    }
    delete data.id;
    return this.sharedService.postElement(data,"/zones")
  }
  addSousZone(data){
    if(data.id && data.id!=0) {
      return this.sharedService.putElement(data,"/sous_zones/"+data.id)
    }
    delete data.id;
    return this.sharedService.postElement(data,"/sous_zones")
  }
  getLocalite(id){
    return this.sharedService.getElement("/localites/"+id)
  }
  deleteSousZone(id){
    return this.sharedService.deleteElement("/sous_zones/"+id)
  }
}
