import { Injectable } from '@angular/core';
import { Entreprise } from '../model/entreprise';
import { SharedService } from 'src/app/shared/service/shared.service';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  entreprises:Entreprise[]=[]
  
  constructor(private sharedService:SharedService) { }
  getEntreprise(){
    return this.sharedService.getElement("/entreprises")
  }
  addEntreprise(data){
    const formData:FormData=new FormData();
    formData.append('denomination',data.denomination)
    formData.append('republique',data.republique)
    formData.append('ville',data.ville)
    formData.append('image',data.image)
    formData.append('ninea',data.ninea)
    formData.append('adresse',data.adresse)

    if(data.id==0)
      return this.sharedService.postElement(formData,"/entreprises")
    else
      return this.sharedService.postElement(formData,"/entreprises/"+data.id)
  }

}
