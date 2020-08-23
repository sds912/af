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
}
