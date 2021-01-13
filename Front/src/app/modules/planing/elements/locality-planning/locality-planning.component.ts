import { FormBuilder, FormGroup } from '@angular/forms';
import {Component, Input} from '@angular/core';
import { InventaireService } from 'src/app/data/services/inventaire/inventaire.service';
import { MessageService } from 'primeng/api';
import { AffectationService } from '../../services/affectation.service';
import { User } from 'src/app/data/schema/user';
import { PlaningService } from '../../services/planing.service';

@Component({
  selector: 'app-locality-planning',
  templateUrl: './locality-planning.component.html',
  styleUrls: ['./locality-planning.component.sass'],
  providers: [MessageService]


})
export class LocalityPlanningComponent { 

 
    
  @Input() localities: LocalityEdit[];
  @Input() subdivisions: string[];
  @Input() inventaire;
  selectedLocalities: any[];
  idCurrentEse: string;
  users: User[];
  userData: User[];
  myId: string;
  debut: string;
  fin: string;
  currentUser: any;
  myAffectations: any[];
  myIdList: number[] = [];


  l0:any;
  l1:any;
  l2:any;
  l3:any;
  l4:any;
  l5:any;

  n1:any
  n2:any
  n3:any
  n4:any
  n5:any
  n6:any





  level1:   LocalityEdit[] = [];
  level2:   LocalityEdit[] = [];
  level3:   LocalityEdit[] = [];
  level4:   LocalityEdit[] = [];
  level5:   LocalityEdit[] = [];
  level6:   LocalityEdit[] = [];
  level7:   LocalityEdit[] = [];
  level8:   LocalityEdit[] = [];
  level9:   LocalityEdit[] = [];
  level10:  LocalityEdit[] = [];




  inventForm: FormGroup;
    
    constructor(
      private formBulder: FormBuilder, 
      private inventaireService: InventaireService,
      private messageService: MessageService,
      private affectationService: AffectationService,
      private planningService: PlaningService) { }

    ngOnInit() {

     
      this.selectedLocalities = [];
      this.idCurrentEse=localStorage.getItem("currentEse");
  
      this.inventaireService.getInventaireByEse(this.idCurrentEse).then((res) => {
        this.localities.forEach((item) => {
          item.debut = this.debut = res[0].debut;
          item.fin = this.fin = res[0].fin;
        })
         
         this.affectationService.users$.subscribe((users) => {this.users = users});
         this.affectationService.userData$.subscribe((users) => {this.userData = users});

      /*
         this.affectationService.myAffects$.subscribe((val) => {
           this.myAffectations = val;
           this.myAffectations.forEach((item) => {
             this.myIdList.push(item.localite.id);
             //console.log(this.myIdList)
           })
         })

         */
      });

      console.log(this.localities)
      
    }


    close(level: number, id: number){

      switch (level)
        {
          case 0:
            this.localities.forEach((locs) => {
            if(locs.id === id){
            locs.opened = false;}})
          break;
          case 1:
              this.level1.forEach((locs) => {
                if(locs.id === id){
                locs.opened = false;}})
          break;
          case 2: 
            this.level2.forEach((locs) => {
            if(locs.id === id){
            locs.opened = false;}})
          break;
          case 3: 
            this.level3.forEach((locs) => {
              if(locs.id === id){
              locs.opened = false;}})
          break;
          case 4: 
          this.level4.forEach((locs) => {
            if(locs.id === id){
            locs.opened = false;}})
          break;
          case 5: 
          this.level5.forEach((locs) => {
            if(locs.id === id){
            locs.opened = false;}})
          break;
          case 6: 
          this.level6.forEach((locs) => {
            if(locs.id === id){
            locs.opened = false;}})
          break;
          case 7: 
          this.level7.forEach((locs) => {
            if(locs.id === id){
            locs.opened = false;}})
          break;
          case 8: 
          this.level8.forEach((locs) => {
            if(locs.id === id){
            locs.opened = false;}})
          break;
          case 9: 
          this.level9.forEach((locs) => {
            if(locs.id === id){
            locs.opened = false;}})
          break;}
}

    open(level: number, id: number, idParent: number){
        switch(level){
          case 0 :
            this.localities.forEach((locs) => {
              if(locs.subdivisions == undefined){locs.subdivisions = []}
              if(locs.id === id){
                locs.opened = true;
                locs.disabled = false;
                this.planningService.getLocalityByLevel(level+1, id).then((val: LocalityEdit[]) => {
                  val.forEach((loc) => {
                  let elt = locs.subdivisions.find((item) => item.id === loc.id);
                  if(elt == undefined){
                    locs?.subdivisions.push(loc);
                  }
                  this.level1 = locs.subdivisions;
                  this.level1.forEach((item) => {
                    item.debut = locs.debut;
                    item.fin = locs.fin;
                  })
                });});}});
          break;
          case 1:
            this.level1.forEach((locs) => {
              if(locs.subdivisions == undefined){locs.subdivisions = []}
              if(locs.id === id){
                locs.opened = true;
                locs.disabled = false;
                this.planningService.getLocalityByLevel(level+1, id).then((val: LocalityEdit[]) => {
                  console.log(val)
                  val.forEach((loc) => {
                   let elt = locs.subdivisions.find((item) => item.id === loc.id);
                   if(elt == undefined){
                    locs?.subdivisions.push(loc);
                   }
                   this.level2 = locs.subdivisions;
                  this.level2.forEach((item) => {
                    item.debut = locs.debut;
                    item.fin = locs.fin;
                  })
                  });});}});
          break;
          case 2:
            this.level2.forEach((locs) => {
              if(locs.subdivisions == undefined){locs.subdivisions = []}
              if(locs.id === id){
                locs.opened = true;
                locs.disabled = false;
                this.planningService.getLocalityByLevel(level+1, id).then((val: LocalityEdit[]) => {
                  console.log(val)
                  val.forEach((loc) => {
                   let elt = locs.subdivisions.find((item) => item.id === loc.id);
                   if(elt == undefined){
                    locs?.subdivisions.push(loc);
                   }
                   this.level3 = locs.subdivisions;
                   this.level3.forEach((item) => {
                    item.debut = locs.debut;
                    item.fin = locs.fin;
                  });
                  });});}});
          break;
          case 3:
            this.level3.forEach((locs) => {
              if(locs.subdivisions == undefined){locs.subdivisions = []}
              if(locs.id === id){
                locs.opened = true;
                locs.disabled = false;
                this.planningService.getLocalityByLevel(level+1, id).then((val: LocalityEdit[]) => {
                  console.log(val)
                  val.forEach((loc) => {
                   let elt = locs.subdivisions.find((item) => item.id === loc.id);
                   if(elt == undefined){
                    locs?.subdivisions.push(loc);
                   }
                   this.level4 = locs.subdivisions;
                   this.level4.forEach((item) => {
                    item.debut = locs.debut;
                    item.fin = locs.fin;
                  })
                  });});}});
          break;
          case 4:
            this.level4.forEach((locs) => {
              if(locs.subdivisions == undefined){locs.subdivisions = []}
              if(locs.id === id){
                locs.opened = true;
                locs.disabled = false;
                this.planningService.getLocalityByLevel(level+1, id).then((val: LocalityEdit[]) => {
                  console.log(val)
                  val.forEach((loc) => {
                   let elt = locs.subdivisions.find((item) => item.id === loc.id);
                   if(elt == undefined){
                    locs?.subdivisions.push(loc);
                   }
                   this.level5 = locs.subdivisions;
                   this.level5.forEach((item) => {
                    item.debut = locs.debut;
                    item.fin = locs.fin;
                  })
                  });})}});
          break;
          case 5:
            this.level5.forEach((locs) => {
              if(locs.subdivisions == undefined){locs.subdivisions = []}
              if(locs.id === id){
                locs.opened = true;
                locs.disabled = false;
                this.planningService.getLocalityByLevel(level+1, id).then((val: LocalityEdit[]) => {
                  console.log(val)
                  val.forEach((loc) => {
                   let elt = locs.subdivisions.find((item) => item.id === loc.id);
                   if(elt == undefined){
                    locs?.subdivisions.push(loc);
                   }
                   this.level6 = locs.subdivisions;
                   this.level6.forEach((item) => {
                    item.debut = locs.debut;
                    item.fin = locs.fin;
                  })
                  });});}});
          break;
          case 6:
            this.level6.forEach((locs) => {
              if(locs.subdivisions == undefined){locs.subdivisions = []}
              if(locs.id === id){
                locs.opened = true;
                locs.disabled = false;
                this.planningService.getLocalityByLevel(level+1, id).then((val: LocalityEdit[]) => {
                  console.log(val)
                  val.forEach((loc) => {
                   let elt = locs.subdivisions.find((item) => item.id === loc.id);
                   if(elt == undefined){
                    locs?.subdivisions.push(loc);
                   }
                   this.level7 = locs.subdivisions;
                   this.level7.forEach((item) => {
                    item.debut = locs.debut;
                    item.fin = locs.fin;
                  })
                  });})}});
          break;
          case 7:
            this.level7.forEach((locs) => {
              if(locs.subdivisions == undefined){locs.subdivisions = []}
              if(locs.id === id){
                locs.opened = true;
                locs.disabled = false;
                this.planningService.getLocalityByLevel(level+1, id).then((val: LocalityEdit[]) => {
                  console.log(val)
                  val.forEach((loc) => {
                   let elt = locs.subdivisions.find((item) => item.id === loc.id);
                   if(elt == undefined){
                    locs?.subdivisions.push(loc);
                   }
                   this.level8 = locs.subdivisions;
                   this.level8.forEach((item) => {
                    item.debut = locs.debut;
                    item.fin = locs.fin;
                  })
                  });})}});
          break;
          case 8:
            this.level8.forEach((locs) => {
              if(locs.subdivisions == undefined){locs.subdivisions = []}
              if(locs.id === id){
                locs.opened = true;
                locs.disabled = false;
                this.planningService.getLocalityByLevel(level+1, id).then((val: LocalityEdit[]) => {
                  console.log(val)
                  val.forEach((loc) => {
                   let elt = locs.subdivisions.find((item) => item.id === loc.id);
                   if(elt == undefined){
                    locs?.subdivisions.push(loc);
                   }
                   this.level9 = locs.subdivisions;
                   this.level9.forEach((item) => {
                    item.debut = locs.debut;
                    item.fin = locs.fin;
                  })
                  });});}});
          break;
          case 9:
            this.level9.forEach((locs) => {
              if(locs.subdivisions == undefined){locs.subdivisions = []}
              if(locs.id === id){
                locs.opened = true;
                locs.disabled = false;
                this.planningService.getLocalityByLevel(level+1, id).then((val: LocalityEdit[]) => {
                  console.log(val)
                  val.forEach((loc) => {
                   let elt = locs.subdivisions.find((item) => item.id === loc.id);
                   if(elt == undefined){
                    locs?.subdivisions.push(loc);
                   }
                   this.level10 = locs.subdivisions;
                   this.level10.forEach((item) => {
                    item.debut = locs.debut;
                    item.fin = locs.fin;
                  })
                  });});}});
          break;}
    }
    
  isErrorDate(date: string, label: string):boolean{

    let dateDebut = new Date(this.debut);

    let dateFin = new Date(this.fin);

     let evDate = new Date(date);

    if(label === "debut"){
     if(dateDebut.getTime() > evDate.getTime() || dateFin.getTime() < evDate.getTime() ){
      this.messageService.add({severity:'Error', summary:'Attention', detail:'Veillez respecter la période d \'inventaire'});
       return false;
     }}


    if(label === "fin"){
      if(dateFin.getTime() < evDate.getTime() || dateDebut.getTime() > evDate.getTime()){
        this.messageService.add({severity:'Error', summary:'Attention', detail:'Veillez respecter la période d \'inventaire'});
      
       return false;
       
        
      }}   

   
    return true;
    
    
  }


  save():void{

    this.users.forEach((user) => {

      this.saveOneByOne(user);

      this.userData.forEach((item) => {
        if(item.id ===  user.id ){
          item.affected = true;
        }
      })

      this.affectationService.addUserData(this.userData);
    })

    this.affectationService.addUser([]);
  }

    back(){
      this.affectationService.addUser([]);
      this.affectationService.toogle(false);
    }


  saveOneByOne(user: User){
    const data = {
      user:user.id,
      inventaire:this.inventaire.id,
      affectations:this.getAffectationToSave(),
      remove:true
    }
    this.planningService.addAfectation(data).then(
      rep=>{
        this.messageService.add({severity:'success', summary:'Brovo!', detail:'Affectations enrégistrées avec succes'});
        this.affectationService.toogle(false);
      },error=>{
        console.log(error);
       
      }
    )


    

   

  }


  getSelectedLocality(locality: LocalityEdit, event: any){
    if(event.target.checked){
      let loc = this.selectedLocalities.find((loc) => loc.id === locality.id);
  
      if(loc === undefined){
        
        locality.selected = true;

        this.selectedLocalities.push(locality);

        let parents: LocalityEdit[] = this.getParents(locality);
        parents.forEach((locc) => {
          let mlocc = this.selectedLocalities.find((loc) => loc.id === locc.id);
          if(mlocc === undefined){
            locc.selected = true;
            locc.disabled = true;
            this.selectedLocalities.push(locc);}});

        let children: LocalityEdit[] = this.getChildren(locality);
        console.log(children)
        children.forEach(
          (item) => item.selected = true);
        

      }
    }else{
      locality.selected  = false;
      
     if(!this.doHaveChild(this.getLocalitiesByLevel(locality.level))){
        this.getParents(locality).forEach((item) => {
          item.selected = false;
          item.disabled = false;
         this.removeDocument(item);
         if(this.getChildren(item).length <= 0){
          console.log(this.getChildren(item));
         }})

      
     }
      
     

      this.removeDocument(locality);

     
    
      
    }

    console.log(this.selectedLocalities);
  }

  offParent(idParent: number, level){
     if(level === 1){
       this.localities.forEach((item) => {
         if(item.id === idParent){
           item.selected = false;
         }
       })
     }
     if(level === 2){
      this.n1.forEach((item) => {
        if(item.id === idParent){
          item.selected = false;
        }
      })
    }
    if(level === 3){
      this.n2.forEach((item) => {
        if(item.id === idParent){
          item.selected = false;
        }
      })
    }
    if(level === 4){
      this.n3.forEach((item) => {
        if(item.id === idParent){
          item.selected = false;
        }
      })
    }
    if(level === 5){
      this.n4.forEach((item) => {
        if(item.id === idParent){
          item.selected = false;
        }
      })
    }
    if(level === 6){
      this.n5.forEach((item) => {
        if(item.id === idParent){
          item.selected = false;
        }
      })
    }

  }


  removeDocument(locality){
    this.selectedLocalities.forEach( (item, index) => {
      if(item === locality) this.selectedLocalities.splice(index,1);
    });
 }

 exist(locality: LocalityEdit, localities: LocalityEdit[]): boolean {
   let answer: boolean
   localities.forEach((item) => {
    if(locality.id === item.id){
      answer = true
    }else{
      answer = false;
    }
   })

   return answer;
 }

 getAffectationToSave(): any[]{
   let affectations: any[] = [];
   this.users?.forEach((user) => {
    this.selectedLocalities.forEach((item) => {
      affectations.push({
        debut: item.debut,
        fin: item.fin,
        inventaire: {id: this.inventaire.id, status: this.inventaire.status},
        localite: item,
        user: user

      })
   })
   })
   
   return affectations;
 }


 formatForSave(localities: any[]) {
  let formatedLocalities: any[];
  localities.forEach((item) => {
    if(item.level === 0){
      if(item['subdivisions'] !== undefined && item.subdivisions.length !== 0){
        formatedLocalities.push({
            id: item.id,
            nom: item.nom,
            parent: '/api/localites/'+item.idParent,
            subdivisions: item.subdivisions
        })
  
        item.subdivisions.forEach((item) => {
          formatedLocalities.push({
            id: item.id,
            nom: item.nom,
            parent: '/api/localites/'+item.idParent,
            subdivisions: item.subdivisions
          })
          item.subdivisions.forEach((item) => {
            formatedLocalities.push({
              id: item.id,
              nom: item.nom,
              parent: '/api/localites/'+item.idParent,
              subdivisions: item.subdivisions
            })
          })
        })
      }
    }

  })
   return formatedLocalities;
  
 }


 getAffectationOf(user){
  /** L'affectation d'un utilisateur */
  this.planningService.getAffectations(`?user.id=${user.id}&inventaire.id=${this.inventaire?.id}`).then(
    res=>{
      this.myAffectations = res;
      console.log(res)
      }
    ,error=>{
      console.log(error)
    }
  )
}


isChecked(id): boolean {
  let state: boolean 
  if(this.myIdList.includes(id)){
    state = true;
  }else{
    state = false
  }
  return state;
}




onDateChange(date: string, level: number, id: number, label: string): void{
 
  switch (level)
  {
    case 0:
      this.localities.forEach((locs) => {
      if(locs.id === id){
        locs.debut = label === 'd' ? date : locs.debut;
        locs.fin = label === 'f' ? date : locs.fin;}})
    break;
    case 1:
        this.level1.forEach((locs) => {
          if(locs.id === id){
          locs.debut = label === 'd' ? date : locs.debut;
          locs.fin = label === 'f' ? date : locs.fin;}})
    break;
    case 2: 
      this.level2.forEach((locs) => {
      if(locs.id === id){
        locs.debut = label === 'd' ? date : locs.debut;
        locs.fin = label === 'f' ? date : locs.fin;
        }})
    break;
    case 3: 
      this.level3.forEach((locs) => {
        if(locs.id === id){
          locs.debut = label === 'd' ? date : locs.debut;
          locs.fin = label === 'f' ? date : locs.fin;
      }})
    break;
    case 4: 
    this.level4.forEach((locs) => {
      if(locs.id === id){
        locs.debut = label === 'd' ? date : locs.debut;
        locs.fin = label === 'f' ? date : locs.fin;
    }})
    break;
    case 5: 
    this.level5.forEach((locs) => {
      if(locs.id === id){
        locs.debut = label === 'd' ? date : locs.debut;
        locs.fin = label === 'f' ? date : locs.fin;
    }})
    break;
    case 6: 
    this.level6.forEach((locs) => {
      if(locs.id === id){
        locs.debut = label === 'd' ? date : locs.debut;
        locs.fin = label === 'f' ? date : locs.fin;
    }})
    break;
    case 7: 
    this.level7.forEach((locs) => {
      if(locs.id === id){
        locs.debut = label === 'd' ? date : locs.debut;
        locs.fin = label === 'f' ? date : locs.fin;
    }})
    break;
    case 8: 
    this.level8.forEach((locs) => {
      if(locs.id === id){
        locs.debut = label === 'd' ? date : locs.debut;
        locs.fin = label === 'f' ? date : locs.fin;
    }})
    break;
    case 9: 
    this.level9.forEach((locs) => {
      if(locs.id === id){
        locs.debut = label === 'd' ? date : locs.debut;
        locs.fin = label === 'f' ? date : locs.fin;
    }})
    break;}


  
};


getParents(loc: LocalityEdit): LocalityEdit[]{

 let parents: LocalityEdit[] = [];

  if(loc.idParent !== undefined){

    if(loc.level === 1){
     let locl0 = this.localities.find((locc) => locc.id === loc.idParent);
     parents.push(locl0);
    
   }

    if(loc.level === 2){
      let locl1 = this.level1.find((locc) => locc.id === loc.idParent);
      let locl0 = this.localities.find((locc) => locc.id === locl1.idParent);
      parents.push(locl1);
      parents.push(locl0);
    }

    if(loc.level === 3){
      let locl2 = this.level2.find((locc) => locc.id === loc.idParent);
      let locl1 = this.level1.find((locc) => locc.id === locl2.idParent);
      let locl0 = this.localities.find((locc) => locc.id === locl1.idParent);
      parents.push(locl2);
      parents.push(locl1);
      parents.push(locl0);
     }

 

    if(loc.level === 4){
      let locl3 = this.level3.find((locc) => locc.id === loc.idParent);
      let locl2 = this.level2.find((locc) => locc.id === locl3.idParent);
      let locl1 = this.level1.find((locc) => locc.id === locl2.idParent);
      let locl0 = this.localities.find((locc) => locc.id === locl1.idParent);
      parents.push(locl3);
      parents.push(locl2);
      parents.push(locl1);
      parents.push(locl0);

     }

    if(loc.level === 5){
      let locl4 = this.level4.find((locc) => locc.id === loc.idParent);
      let locl3 = this.level3.find((locc) => locc.id === locl4.idParent);
      let locl2 = this.level2.find((locc) => locc.id === locl3.idParent);
      let locl1 = this.level1.find((locc) => locc.id === locl2.idParent);
      let locl0 = this.localities.find((locc) => locc.id === locl1.idParent);
      parents.push(locl4);
      parents.push(locl3);
      parents.push(locl2);
      parents.push(locl1);
      parents.push(locl0);

     }

    if(loc.level === 6){
      let locl5 = this.level5.find((locc) => locc.id === loc.idParent);
      let locl4 = this.level4.find((locc) => locc.id === locl5.idParent);
      let locl3 = this.level3.find((locc) => locc.id === locl4.idParent);
      let locl2 = this.level2.find((locc) => locc.id === locl3.idParent);
      let locl1 = this.level1.find((locc) => locc.id === locl2.idParent);
      let locl0 = this.localities.find((locc) => locc.id === locl1.idParent);
      parents.push(locl5);
      parents.push(locl4);
      parents.push(locl3);
      parents.push(locl2);
      parents.push(locl1);
      parents.push(locl0);

      }

    if(loc.level === 7){
      let locl6 = this.level6.find((locc) => locc.id === loc.idParent);
      let locl5 = this.level5.find((locc) => locc.id === locl6.idParent);
      let locl4 = this.level4.find((locc) => locc.id === locl5.idParent);
      let locl3 = this.level3.find((locc) => locc.id === locl4.idParent);
      let locl2 = this.level2.find((locc) => locc.id === locl3.idParent);
      let locl1 = this.level1.find((locc) => locc.id === locl2.idParent);
      let locl0 = this.localities.find((locc) => locc.id === locl1.idParent);
      parents.push(locl6);
      parents.push(locl5);
      parents.push(locl4);
      parents.push(locl3);
      parents.push(locl2);
      parents.push(locl1);
      parents.push(locl0);

      }

    if(loc.level === 8){
      let locl7 = this.level7.find((locc) => locc.id === loc.idParent);
      let locl6 = this.level6.find((locc) => locc.id === locl7.idParent);
      let locl5 = this.level5.find((locc) => locc.id === locl6.idParent);
      let locl4 = this.level4.find((locc) => locc.id === locl5.idParent);
      let locl3 = this.level3.find((locc) => locc.id === locl4.idParent);
      let locl2 = this.level2.find((locc) => locc.id === locl3.idParent);
      let locl1 = this.level1.find((locc) => locc.id === locl2.idParent);
      let locl0 = this.localities.find((locc) => locc.id === locl1.idParent);
      parents.push(locl7);
      parents.push(locl6);
      parents.push(locl5);
      parents.push(locl4);
      parents.push(locl3);
      parents.push(locl2);
      parents.push(locl1);
      parents.push(locl0);

     }

    if(loc.level === 9){
      let locl8 = this.level8.find((locc) => locc.id === loc.idParent);
      let locl7 = this.level7.find((locc) => locc.id === locl8.idParent);
      let locl6 = this.level6.find((locc) => locc.id === locl7.idParent);
      let locl5 = this.level5.find((locc) => locc.id === locl6.idParent);
      let locl4 = this.level4.find((locc) => locc.id === locl5.idParent);
      let locl3 = this.level3.find((locc) => locc.id === locl4.idParent);
      let locl2 = this.level2.find((locc) => locc.id === locl3.idParent);
      let locl1 = this.level1.find((locc) => locc.id === locl2.idParent);
      let locl0 = this.localities.find((locc) => locc.id === locl1.idParent);
      parents.push(locl8);
      parents.push(locl7);
      parents.push(locl6);
      parents.push(locl5);
      parents.push(locl4);
      parents.push(locl3);
      parents.push(locl2);
      parents.push(locl1);
      parents.push(locl0);

     }

    
  }
  return  parents;
  
}

getChildren(loc: LocalityEdit): LocalityEdit[]{

  let children: LocalityEdit[] = [];
 
   if(loc.idParent !== undefined){
 
     if(loc.level === 8){
      let locl0 = this.localities.find((locc) => locc.idParent === loc.id);
      children.push(locl0);
     
    }
 
     if(loc.level === 7){
       let locl1 = this.level1.find((locc) => locc.idParent === loc.id);
       let locl0 = this.localities.find((locc) => locc.idParent === locl1.id);
       children.push(locl1);
       children.push(locl0);
     }
 
     if(loc.level === 6){
       let locl2 = this.level2.find((locc) => locc.idParent === loc.id);
       let locl1 = this.level1.find((locc) => locc.idParent === locl2.id);
       let locl0 = this.localities.find((locc) => locc.idParent === locl1.id);
       children.push(locl2);
       children.push(locl1);
       children.push(locl0);
      }
 
  
 
     if(loc.level === 5){
       let locl3 = this.level3.find((locc) => locc.idParent === loc.id);
       let locl2 = this.level2.find((locc) => locc.idParent === locl3.id);
       let locl1 = this.level1.find((locc) => locc.idParent === locl2.id);
       let locl0 = this.localities.find((locc) => locc.idParent === locl1.id);
       children.push(locl3);
       children.push(locl2);
       children.push(locl1);
       children.push(locl0);
 
      }
 
     if(loc.level === 4){
      let locl5 = this.level5.find((locc) => locc.idParent === loc.id);
      let locl6 = this.level6.find((locc) => locc.idParent === locl5.id);
      let locl7 = this.level7.find((locc) => locc.idParent === locl6.id);
      let locl8 = this.level8.find((locc) => locc.idParent === locl7.id);
      let locl9 = this.level9.find((locc) => locc.idParent === locl8.id);
      let locl10 = this.level10.find((locc) => locc.idParent === locl9.id);

       children.push(locl8);
       children.push(locl7);
       children.push(locl6);
       children.push(locl5);
       children.push(locl10);
 
      }
 
     if(loc.level === 3){
      let locl4 = this.level4.find((locc) => locc.idParent === loc.id);
      let locl5 = this.level5.find((locc) => locc.idParent === locl4.id);
      let locl6 = this.level6.find((locc) => locc.idParent === locl5.id);
      let locl7 = this.level7.find((locc) => locc.idParent === locl6.id);
      let locl8 = this.level8.find((locc) => locc.idParent === locl7.id);
      let locl9 = this.level9.find((locc) => locc.idParent === locl8.id);
      let locl10 = this.level10.find((locc) => locc.idParent === locl9.id);

       children.push(locl8);
       children.push(locl7);
       children.push(locl6);
       children.push(locl5);
       children.push(locl4);
       children.push(locl10);
 
       }
 
     if(loc.level === 2){
      let locl3 = this.level3.find((locc) => locc.idParent === loc.id);
      let locl4 = this.level4.find((locc) => locc.idParent === locl3.id);
      let locl5 = this.level5.find((locc) => locc.idParent === locl4.id);
      let locl6 = this.level6.find((locc) => locc.idParent === locl5.id);
      let locl7 = this.level7.find((locc) => locc.idParent === locl6.id);
      let locl8 = this.level8.find((locc) => locc.idParent === locl7.id);
      let locl9 = this.level9.find((locc) => locc.idParent === locl8.id);
      let locl10 = this.level10.find((locc) => locc.idParent === locl9.id);

       children.push(locl8);
       children.push(locl7);
       children.push(locl6);
       children.push(locl5);
       children.push(locl4);
       children.push(locl3);
       children.push(locl10);
       
 
       }
 
     if(loc.level === 1){

      let locl2 = this.level2.find((locc) => locc.idParent === loc.id);
      let locl3 = this.level3.find((locc) => locc.idParent === locl2.id);
      let locl4 = this.level4.find((locc) => locc.idParent === locl3.id);
      let locl5 = this.level5.find((locc) => locc.idParent === locl4.id);
      let locl6 = this.level6.find((locc) => locc.idParent === locl5.id);
      let locl7 = this.level7.find((locc) => locc.idParent === locl6.id);
      let locl8 = this.level8.find((locc) => locc.idParent === locl7.id);
      let locl9 = this.level9.find((locc) => locc.idParent === locl8.id);
      let locl10 = this.level10.find((locc) => locc.idParent === locl9.id);

       children.push(locl8);
       children.push(locl7);
       children.push(locl6);
       children.push(locl5);
       children.push(locl4);
       children.push(locl3);
       children.push(locl2);
       children.push(locl10);
      
 
      }
 
     if(loc.level === 0){
      let locl1 = this.level1.find((locc) => locc.idParent === loc.id);
      let locl2 = this.level2.find((locc) => locc.idParent === locl1.id);
      let locl3 = this.level3.find((locc) => locc.idParent === locl2.id);
      let locl4 = this.level4.find((locc) => locc.idParent === locl3.id);
      let locl5 = this.level5.find((locc) => locc.idParent === locl4.id);
      let locl6 = this.level6.find((locc) => locc.idParent === locl5.id);
      let locl7 = this.level7.find((locc) => locc.idParent === locl6.id);
      let locl8 = this.level8.find((locc) => locc.idParent === locl7.id);
      let locl9 = this.level9.find((locc) => locc.idParent === locl8.id);
      let locl10 = this.level10.find((locc) => locc.idParent === locl9.id);

       children.push(locl8);
       children.push(locl7);
       children.push(locl6);
       children.push(locl5);
       children.push(locl4);
       children.push(locl3);
       children.push(locl2);
       children.push(locl1);
       children.push(locl10);
 
      }
 
     
   }
   return  children;
   
 }


 doHaveChild(locs: LocalityEdit[]) : boolean {
   let state : boolean = false;
   locs.forEach((item)  => {
     if(item.selected){
       state = true;
     }
   })
   return state;
 }




  getLocalitiesByLevel(level: number): LocalityEdit[] {
      let locs: LocalityEdit[] = [];

      switch(level){

        case 0 :
          locs = this.localities
        break;
      
        case 1 :
          locs = this.level1;
        break;

        case 2 :
          locs = this.level2;
        break;

        case 3 :
          locs = this.level3;
        break;

        case 4 :
          locs = this.level4;
        break;

        case 5 :
          locs = this.level5;
        break;

        case 6 :
          locs = this.level6;
        break;

        case 7 :
          locs = this.level7;
        break;

      }

    

      return locs;
   }


}










export interface LocalityEdit{
  id?: number;
  position?: string[];
  nom?: string;
  level?: number;
  idParent?: number;
  createur?:{
      id: number;
      nom: string;
  },
  selected?: boolean;
  opened?: boolean;
  debut?: string;
  fin?: string;
  subdivisions: LocalityEdit[];
  disabled: boolean;

}


