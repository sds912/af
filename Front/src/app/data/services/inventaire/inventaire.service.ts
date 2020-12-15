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
  getLocalite(id){
    return this.sharedService.getElement("/localites/"+id)
  }
  getLocalitesOfEse(id){
    return this.sharedService.getElement("/localites?entreprise.id="+id)
  }
  filterLocalites(entreprise: any, level = null, parent = null){
    let filters = '';
    if (level !== null) {
      filters = `&level=${level}`
    }
    if (parent !== null) {
      filters = `&parent=${parent}`
    }
    return this.sharedService.getElement(`/localites?entreprise.id=${entreprise}${filters}`)
  }
  deleteLoc(id){
    return this.sharedService.deleteElement("/localites/"+id)
  }
  getInventaire(){
    return this.sharedService.getElement("/inventaires")
  }
  getInventaireById(id){
    return this.sharedService.getElement("/inventaires/"+id)
  }
  getInventaireByEse(id){
    return this.sharedService.getElement("/inventaires?entreprise.id="+id)
  }
  addInventaire(data){
    const formData:FormData=new FormData();
    formData.append('dateInv',data.dateInv)
    formData.append('debut',data.debut)
    formData.append('fin',data.fin)
    formData.append('lieuReunion',data.lieuReunion)
    formData.append('dateReunion',data.dateReunion)

    const decisionCC=data.decisionCC
    for(let i=1;i<=decisionCC.length;i++){
      formData.append('decisionCC'+i,decisionCC[i-1])
    }
    formData.append('countDecisionCC',decisionCC.length)

    formData.append('presiComite',data.presiComite)
    formData.append('membresCom',data.membresCom)
    formData.append('presentsReunion',data.presentsReunion)
    formData.append('presentsReunionOut',data.presentsReunionOut)

    
    
    formData.append('entreprise',data.entreprise)
    formData.append('localites',data.localites)
    formData.append('localInstructionPv',data.localInstructionPv)
    let instrucCreer=data.instrucCreer

    if(data.localInstructionPv[0]=='creation'){
      formData.append('bloc1e1',instrucCreer.bloc1e1)
      formData.append('bloc1e2',instrucCreer.bloc1e2)
      formData.append('bloc1e3',instrucCreer.bloc1e3)

      formData.append('bloc2e1',instrucCreer.bloc2e1)
      formData.append('bloc2e2',instrucCreer.bloc2e2)
      formData.append('bloc2e3',instrucCreer.bloc2e3)

      formData.append('bloc3e1',instrucCreer.bloc3e1)
      formData.append('bloc3e2',instrucCreer.bloc3e2)
      formData.append('bloc3e3',instrucCreer.bloc3e3)
      formData.append('bloc3e4',instrucCreer.bloc3e4)
      formData.append('signataireInst',instrucCreer.signataire)
    }else{
      const instructions=data.instructions
      for(let i=1;i<=instructions.length;i++){
        formData.append('instruction'+i,instructions[i-1])
      }
      formData.append('countInstruction',instructions.length)
    }

    let pvReunionCreer=data.pvReunionCreer
    if(data.localInstructionPv[1]=='creation'){
      formData.append('pvCB1',pvReunionCreer[0][0])
      formData.append('pvCB2',pvReunionCreer[0][1])
      formData.append('pvCB3',pvReunionCreer[0][2])
      formData.append('pvCB4',pvReunionCreer[0][3])//signataires
      let tabDel=pvReunionCreer[1]
      for(let i=1;i<=tabDel.length;i++){
        formData.append('pvDelTitre'+i,tabDel[i-1].titre)
        formData.append('pvDelContent'+i,tabDel[i-1].content)
      }
      formData.append('countPvCreer',tabDel.length)
    }else{
      const pvReunion=data.pvReunion
      for(let i=1;i<=pvReunion.length;i++){
        formData.append('pvReunion'+i,pvReunion[i-1])
      }
      formData.append('countPvReunion',pvReunion.length)
    }

    if(data.id && data.id!=0) {
      return this.sharedService.postElement(formData,"/inventaires/"+data.id)//si put avec form data tableau
    }
    return this.sharedService.postElement(formData,"/inventaires")
  }
  getDataForMobile(id){
    return this.sharedService.getElement("/mobile/data/"+id)
  }
  getStatusInstr(id){
    return this.sharedService.getElement("/approve_insts/status/inventaire/"+id)
  }
  approvInstr(id){
    return this.sharedService.getElement("/approve_insts/inventaire/"+id)
  }
  sendMobileData(data){
    return this.sharedService.postElement(data,"/mobile/data")
  }
  addCode(data){
    return this.sharedService.postElement(data,"/code/defectueux")
  }
}
