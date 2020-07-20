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
  deleteLoc(id){
    return this.sharedService.deleteElement("/localites/"+id)
  }
  deleteZone(id){
    return this.sharedService.deleteElement("/zones/"+id)
  }
  getInventaire(){
    return this.sharedService.getElement("/inventaires")
  }
  addInventaire(data){
    const formData:FormData=new FormData();
    formData.append('debut',data.debut)
    formData.append('fin',data.fin)
    formData.append('lieuReunion',data.lieuReunion)
    formData.append('dateReunion',data.dateReunion)
    const instructions=data.instructions
    for(let i=1;i<=instructions.length;i++){
      formData.append('instruction'+i,instructions[i-1])
    }
    formData.append('countInstruction',instructions.length)

    const decisionCC=data.decisionCC
    for(let i=1;i<=decisionCC.length;i++){
      formData.append('decisionCC'+i,decisionCC[i-1])
    }
    formData.append('countDecisionCC',decisionCC.length)

    formData.append('presiComite',data.presiComite)
    formData.append('membresCom',data.membresCom)
    formData.append('presentsReunion',data.presentsReunion)
    formData.append('presentsReunionOut',data.presentsReunionOut)

    const pvReunion=data.pvReunion
    for(let i=1;i<=pvReunion.length;i++){
      formData.append('pvReunion'+i,pvReunion[i-1])
    }
    formData.append('countPvReunion',pvReunion.length)
    
    formData.append('entreprise',data.entreprise)
    formData.append('localites',data.localites)
    formData.append('zones',data.zones)
    formData.append('sousZones',data.sousZones)
    formData.append('localInstructionPv',data.localInstructionPv)
    let instrucCreer=data.instrucCreer
    if(data.localInstructionPv[0]=='creation'){
      formData.append('bloc1e1',instrucCreer.bloc1e1)
      formData.append('bloc1e2',instrucCreer.bloc1e1)
      formData.append('bloc1e3',instrucCreer.bloc1e3)

      formData.append('bloc2e1',instrucCreer.bloc2e1)
      formData.append('bloc2e2',instrucCreer.bloc2e2)
      formData.append('bloc2e3',instrucCreer.bloc2e3)

      formData.append('bloc3e1',instrucCreer.bloc2e1)
      formData.append('bloc3e2',instrucCreer.bloc2e2)
      formData.append('bloc3e3',instrucCreer.bloc2e3)
      formData.append('bloc3e4',instrucCreer.bloc2e4)
    }
    if(data.id && data.id!=0) {
      return this.sharedService.postElement(formData,"/inventaires/"+data.id)//si put avec form data tableau
    }
    return this.sharedService.postElement(formData,"/inventaires")
  }
}
