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
  debut: string = null;
  fin: string = null;
  currentUser: any;
  myAffectations: any[];
  mode:boolean;



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
      private inventaireService: InventaireService,
      private messageService: MessageService,
      private affectationService: AffectationService,
      private planningService: PlaningService) { }

    ngOnInit() {
      this.affectationService.selectedLocData$.subscribe((locs) => this.selectedLocalities = locs)
      this.idCurrentEse=localStorage.getItem("currentEse");
      this.inventaireService.getInventaireByEse(this.idCurrentEse).then((res) => {
      this.affectationService.users$.subscribe((users) => {this.users = users});
      this.affectationService.userData$.subscribe((users) => {this.userData = users});

      this.formater();
      
      }); 
      this.affectationService.myAffects$.subscribe((affects: any[]) => {
        this.myAffectations = affects;
      })

      this.debut = this.inventaire.debut;
      this.fin = this.inventaire.fin;
      this.affectationService.edit$.subscribe((mode) => this.mode = mode);
    }


    



formater(){
  this.localities.forEach((l) =>{
    l.opened = false;
    l.selected = false;
    l.disabled = false;
    l.debut = this.debut;
    l.fin = this.fin;
    l.subdivisions.forEach((l) => {
      l.opened = false;
      l.selected = false;
      l.disabled = false;
      l.debut = this.debut;
      l.fin = this.fin;
      l.subdivisions.forEach((l) => {
        l.opened = false;
        l.selected = false;
        l.disabled = false;
        l.debut = this.debut;
        l.fin = this.fin;
        l.subdivisions.forEach((l) => {
          l.opened = false;
          l.selected = false;
          l.disabled = false;
          l.debut = this.debut;
          l.fin = this.fin;
          l.subdivisions.forEach((l) => {
            l.opened = false;
            l.selected = false;
            l.disabled = false;
            l.debut = this.debut;
            l.fin = this.fin;
            l.subdivisions.forEach((l) => {
              l.opened = false;
              l.selected = false;
              l.disabled = false;
              l.debut = this.debut;
              l.fin = this.fin;
              l.subdivisions.forEach((l) => {
                l.opened = false;
                l.selected = false;
                l.disabled = false;
                l.debut = this.debut;
                l.fin = this.fin;
                l.subdivisions.forEach((l) => {
                  l.opened = false;
                  l.selected = false;
                  l.disabled = false;
                  l.debut = this.debut;
                  l.fin = this.fin;
                  l.subdivisions.forEach((l) => {
                    l.opened = false;
                    l.selected = false;
                    l.disabled = false;
                    l.debut = this.debut;
                    l.fin = this.fin;
              
                  })
            
                })
          
              })
        
            })
      
          })
    
        })
  
      })

    })

   
  });
  
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
    this.affectationService.addSelectedLoc([]);
      this.formater();
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

      switch(locality.level){
        case 0:
          this.localities.forEach((item)=> {
            if(item.id == locality.id){
              item.selected = true;
              this.addLocInSelectedLocs(item);
            item.subdivisions.forEach((item)=>{
              item.selected = true;
              this.addLocInSelectedLocs(item);
              item.subdivisions.forEach((item)=>{
                item.selected = true;
                this.addLocInSelectedLocs(item);
                item.subdivisions.forEach((item)=>{
                  item.selected = true;
                  this.addLocInSelectedLocs(item);
                  item.subdivisions.forEach((item)=>{
                    item.selected = true;
                    this.addLocInSelectedLocs(item);
                    item.subdivisions.forEach((item)=>{
                      item.selected = true;
                      this.addLocInSelectedLocs(item);
                      item.subdivisions.forEach((item)=>{
                        item.selected = true;
                        this.addLocInSelectedLocs(item);
                        item.subdivisions.forEach((item)=>{
                          item.selected = true;
                          this.addLocInSelectedLocs(item);
                          item.subdivisions.forEach((item)=>{
                            item.selected = true;
                            this.addLocInSelectedLocs(item);
                            item.subdivisions.forEach((item)=>{
                              item.selected = true;})})})})})})})})})}})
        break;

        case 1:
          this.localities.forEach((item)=> {
            item.subdivisions.forEach((item)=>{
              if(item.id == locality.id){
              let parents: LocalityEdit[] = this.getParents(item);
              parents.forEach((item) => {
                item.selected = true;
                this.addLocInSelectedLocs(item);
              })
              item.selected = true;
              this.addLocInSelectedLocs(item);
              item.subdivisions.forEach( (item)=>{
                item.selected = true;
                this.addLocInSelectedLocs(item)
                item.subdivisions.forEach((item)=>{
                  item.selected = true;
                  this.addLocInSelectedLocs(item)
                  item.subdivisions.forEach((item)=>{
                    item.selected = true;
                    this.addLocInSelectedLocs(item)
                    item.subdivisions.forEach((item)=>{
                      item.selected = true;
                      this.addLocInSelectedLocs(item)
                      item.subdivisions.forEach((item)=>{
                        item.selected = true;
                        this.addLocInSelectedLocs(item)
                        item.subdivisions.forEach((item)=>{
                          item.selected = true;
                          this.addLocInSelectedLocs(item)
                          item.subdivisions.forEach((item)=>{
                            item.selected = true;
                            this.addLocInSelectedLocs(item)
                            item.subdivisions.forEach((item)=>{
                              item.selected = true;
                              this.addLocInSelectedLocs(item)})})})})})})})})}})})
        break;
        case 2:
          this.localities.forEach((item)=> {
            item.subdivisions.forEach((item)=>{
              item.subdivisions.forEach((item)=>{
                if(item.id == locality.id){
                let parents: LocalityEdit[] = this.getParents(item);
                parents.forEach((item) => {
                  item.selected = true;
                  this.addLocInSelectedLocs(item);
                })
                item.selected = true;
                this.addLocInSelectedLocs(item);

                item.subdivisions.forEach( (item)=>{
                  item.selected = true;
                  this.addLocInSelectedLocs(item)
                  item.subdivisions.forEach((item)=>{
                    item.selected = true;
                    this.addLocInSelectedLocs(item)
                    item.subdivisions.forEach((item)=>{
                      item.selected = true;
                      this.addLocInSelectedLocs(item)
                      item.subdivisions.forEach((item)=>{
                        item.selected = true;
                        this.addLocInSelectedLocs(item)
                        item.subdivisions.forEach((item)=>{
                          item.selected = true;
                          this.addLocInSelectedLocs(item)
                          item.subdivisions.forEach((item)=>{
                            item.selected = true;
                            this.addLocInSelectedLocs(item)
                            item.subdivisions.forEach((item)=>{
                              item.selected = true;
                              this.addLocInSelectedLocs(item)})})})})})})})}})})})
        break;
        case 3:
          this.localities.forEach((item)=> {
            item.subdivisions.forEach((item)=>{
              item.subdivisions.forEach((item)=>{
                item.subdivisions.forEach((item)=>{
                  if(item.id == locality.id){
                  let parents: LocalityEdit[] = this.getParents(item);
                  parents.forEach((item) => {
                    item.selected = true;
                    this.addLocInSelectedLocs(item);
                  })
                  item.selected = true;
                  this.addLocInSelectedLocs(item);
                  item.subdivisions.forEach((item)=>{
                    item.selected = true;
                    this.addLocInSelectedLocs(item)
                    item.subdivisions.forEach((item)=>{
                      item.selected = true;
                      this.addLocInSelectedLocs(item)
                      item.subdivisions.forEach((item)=>{
                        item.selected = true;
                        this.addLocInSelectedLocs(item)
                        item.subdivisions.forEach((item)=>{
                          item.selected = true;
                          this.addLocInSelectedLocs(item)
                          item.subdivisions.forEach((item)=>{
                            item.selected = true;
                            this.addLocInSelectedLocs(item)
                            item.subdivisions.forEach((item)=>{
                              item.selected = true;
                              this.addLocInSelectedLocs(item)})})})})})})}})})})})
        break;
        case 4:
          this.localities.forEach((item)=> {
            item.subdivisions.forEach((item)=>{
              item.subdivisions.forEach((item)=>{
                item.subdivisions.forEach((item)=>{
                  item.subdivisions.forEach((item)=>{
                    if(item.id == locality.id){
                    let parents: LocalityEdit[] = this.getParents(item);
                    parents.forEach((item) => {
                        item.selected = true;
                        this.addLocInSelectedLocs(item);
                      });
                      item.selected = true;
                    this.addLocInSelectedLocs(item);
                    
                    item.subdivisions.forEach((item)=>{
                      item.selected = true;
                      this.addLocInSelectedLocs(item)
                      item.subdivisions.forEach((item)=>{
                        item.selected = true;
                        this.addLocInSelectedLocs(item)
                        item.subdivisions.forEach((item)=>{
                          item.selected = true;
                          this.addLocInSelectedLocs(item)
                          item.subdivisions.forEach((item)=>{
                            item.selected = true;
                            this.addLocInSelectedLocs(item)
                            item.subdivisions.forEach((item)=>{
                              item.selected = true;
                              this.addLocInSelectedLocs(item)})})})})})}})})})})})
        break;
      }
      
        

      
    }else{

      switch(locality.level){
        case 0:
          this.localities.forEach((item)=> {
            if(item.id == locality.id){
              item.selected = false;
              this.removeLocFromSelectedLocs(item);
            item.subdivisions.forEach((item)=>{
              item.selected = false;
              this.removeLocFromSelectedLocs(item);
              item.subdivisions.forEach((item)=>{
                item.selected = false;
                this.removeLocFromSelectedLocs(item);
                item.subdivisions.forEach((item)=>{
                  item.selected = false;
                  this.removeLocFromSelectedLocs(item);
                  item.subdivisions.forEach((item)=>{
                    item.selected = false;
                    this.removeLocFromSelectedLocs(item);
                    item.subdivisions.forEach((item)=>{
                      item.selected = false;
                      this.removeLocFromSelectedLocs(item);
                      item.subdivisions.forEach((item)=>{
                        item.selected = false;
                        this.removeLocFromSelectedLocs(item);
                        item.subdivisions.forEach((item)=>{
                          item.selected = false;
                          this.removeLocFromSelectedLocs(item);
                          item.subdivisions.forEach((item)=>{
                            item.selected = false;
                            this.removeLocFromSelectedLocs(item);
                            item.subdivisions.forEach((item)=>{
                              item.selected = false;
                              this.removeLocFromSelectedLocs(item);})})})})})})})})})}})
        break;

        case 1:
          this.localities.forEach((item)=> {
            item.subdivisions.forEach((item)=>{
              if(item.id == locality.id){
                item.selected = false;
                this.removeLocFromSelectedLocs(item);
                let parents: LocalityEdit[] = this.getParents(item);
                if(!this.doHaveChild(item)){
                  parents.forEach((item) => {
                      this.removeLocFromSelectedLocs(item);
                      item.selected = false;
                  })};
              
              item.subdivisions.forEach( (item)=>{
                item.selected = false;
                this.removeLocFromSelectedLocs(item);
                item.subdivisions.forEach((item)=>{
                  item.selected = false;
                  this.removeLocFromSelectedLocs(item);
                  item.subdivisions.forEach((item)=>{
                    item.selected = false;
                    this.removeLocFromSelectedLocs(item);
                    item.subdivisions.forEach((item)=>{
                      item.selected = false;
                      this.removeLocFromSelectedLocs(item);
                      item.subdivisions.forEach((item)=>{
                        item.selected = false;
                        this.removeLocFromSelectedLocs(item);
                        item.subdivisions.forEach((item)=>{
                          item.selected = false;
                          this.removeLocFromSelectedLocs(item);
                          item.subdivisions.forEach((item)=>{
                            item.selected = false;
                            this.removeLocFromSelectedLocs(item);
                            item.subdivisions.forEach((item)=>{
                              item.selected = false;
                              this.removeLocFromSelectedLocs(item);})})})})})})})})}})})
        break;
        case 2:
          this.localities.forEach((item)=> {
            item.subdivisions.forEach((item)=>{
              item.subdivisions.forEach((item)=>{
                if(item.id == locality.id){
                item.selected = false;
                this.removeLocFromSelectedLocs(item);
                let parents: LocalityEdit[] = this.getParents(item);
                if(!this.doHaveChild(item)){
                  parents.forEach((item) => {
                      this.removeLocFromSelectedLocs(item);
                      item.selected = false;
                  })};
                
                item.subdivisions.forEach( (item)=>{
                  item.selected = false;
                  this.removeLocFromSelectedLocs(item);
                  item.subdivisions.forEach((item)=>{
                    item.selected = false;
                    this.removeLocFromSelectedLocs(item);
                    item.subdivisions.forEach((item)=>{
                      item.selected = false;
                      this.removeLocFromSelectedLocs(item);
                      item.subdivisions.forEach((item)=>{
                        item.selected = false;
                        this.removeLocFromSelectedLocs(item);
                        item.subdivisions.forEach((item)=>{
                          item.selected = false;
                          this.removeLocFromSelectedLocs(item);
                          item.subdivisions.forEach((item)=>{
                            item.selected = false;
                            this.removeLocFromSelectedLocs(item);
                            item.subdivisions.forEach((item)=>{
                              item.selected = false;
                              this.removeLocFromSelectedLocs(item);})})})})})})})}})})})
        break;
        case 3:
          this.localities.forEach((item)=> {
            item.subdivisions.forEach((item)=>{
              item.subdivisions.forEach((item)=>{
                item.subdivisions.forEach((item)=>{
                  if(item.id == locality.id){
                    item.selected = false;
                    this.removeLocFromSelectedLocs(item);
                    let parents: LocalityEdit[] = this.getParents(item);
                    if(!this.doHaveChild(item)){
                    parents.forEach((item) => {
                        this.removeLocFromSelectedLocs(item);
                        item.selected = false;
                    })};
                  
                  item.subdivisions.forEach((item)=>{
                    item.selected = false;
                    this.removeLocFromSelectedLocs(item);
                    item.subdivisions.forEach((item)=>{
                      item.selected = false;
                      this.removeLocFromSelectedLocs(item);
                      item.subdivisions.forEach((item)=>{
                        item.selected = false;
                        this.removeLocFromSelectedLocs(item);
                        item.subdivisions.forEach((item)=>{
                          item.selected = false;
                          this.removeLocFromSelectedLocs(item);
                          item.subdivisions.forEach((item)=>{
                            item.selected = false;
                            this.removeLocFromSelectedLocs(item);
                            item.subdivisions.forEach((item)=>{
                              item.selected = false;
                              this.removeLocFromSelectedLocs(item);})})})})})})}})})})})
        break;
        case 4:
          this.localities.forEach((item)=> {
            item.subdivisions.forEach((item)=>{
              item.subdivisions.forEach((item)=>{
                item.subdivisions.forEach((item)=>{
                  item.subdivisions.forEach((item)=>{
                    if(item.id == locality.id){
                    item.selected = false;
                    this.removeLocFromSelectedLocs(item);
                    let parents: LocalityEdit[] = this.getParents(item);
                    if(!this.doHaveChild(item)){
                      parents.forEach((item) => {
                          this.removeLocFromSelectedLocs(item);
                          item.selected = false;
                      })};
                    
                    item.subdivisions.forEach((item)=>{
                      item.selected = false;
                      this.removeLocFromSelectedLocs(item);
                      item.subdivisions.forEach((item)=>{
                        item.selected = false;
                        this.removeLocFromSelectedLocs(item);
                        item.subdivisions.forEach((item)=>{
                          item.selected = false;
                          this.removeLocFromSelectedLocs(item);
                          item.subdivisions.forEach((item)=>{
                            item.selected = false;
                            this.removeLocFromSelectedLocs(item);
                            item.subdivisions.forEach((item)=>{
                              item.selected = false;
                              this.removeLocFromSelectedLocs(item);})})})})})}})})})})})
        break;
      }}}

 


  removeLocFromSelectedLocs(locality: LocalityEdit){
    this.selectedLocalities.forEach( (item, index) => {
      if(item === locality) this.selectedLocalities.splice(index,1);
    });
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


isChecked(loc: LocalityEdit): boolean{
  let state: boolean = false;
  let affect = this.myAffectations.find((affec) => affec.localite.id === loc.id );
  if(affect !== undefined) state = true;
  return state;
}

  




addLocInSelectedLocs(loc: LocalityEdit){
let mloc = this.selectedLocalities.find((item) => item.id === loc.id);
if(mloc === undefined){ 
  this.selectedLocalities.push(loc);
  this.affectationService.addSelectedLoc(this.selectedLocalities);
}}


onDateChange(date: string, level: number, id: number, label: string): void{
 
  switch(level){
    case 0:
      this.localities.forEach((item)=> {
        if(item.id == id){
          item.debut = label === 'd' ? date : item.debut;
          item.fin = label === 'f' ? date : item.fin;
        item.subdivisions.forEach((item)=>{
          item.debut = label === 'd' ? date : item.debut;
          item.fin = label === 'f' ? date : item.fin;
          item.subdivisions.forEach((item)=>{
            item.debut = label === 'd' ? date : item.debut;
            item.fin = label === 'f' ? date : item.fin;
            item.subdivisions.forEach((item)=>{
              item.debut = label === 'd' ? date : item.debut;
              item.fin = label === 'f' ? date : item.fin;
              item.subdivisions.forEach((item)=>{
                item.debut = label === 'd' ? date : item.debut;
                item.fin = label === 'f' ? date : item.fin;
                item.subdivisions.forEach((item)=>{
                  item.debut = label === 'd' ? date : item.debut;
                  item.fin = label === 'f' ? date : item.fin;
                  item.subdivisions.forEach((item)=>{
                    item.debut = label === 'd' ? date : item.debut;
                    item.fin = label === 'f' ? date : item.fin;
                    item.subdivisions.forEach((item)=>{
                      item.debut = label === 'd' ? date : item.debut;
                      item.fin= label === 'f' ? date : item.fin;
                      item.subdivisions.forEach((item)=>{
                        item.debut = label === 'd' ? date : item.debut;
                        item.fin = label === 'f' ? date : item.fin;
                        
                        item.subdivisions.forEach((item)=>{
                        item.debut = label === 'd' ? date : item.debut;
                        item.fin = label === 'f' ? date : item.fin;
                        })})})})})})})})})}})
    break;

    case 1:
      this.localities.forEach((item)=> {
        item.subdivisions.forEach((item)=>{
          if(item.id == id){
            item.debut = label === 'd' ? date : item.debut;
            item.fin = label === 'f' ? date : item.fin;
          item.subdivisions.forEach( (item)=>{
            item.debut = label === 'd' ? date : item.debut;
            item.fin = label === 'f' ? date : item.fin;
            item.subdivisions.forEach((item)=>{
              item.debut = label === 'd' ? date : item.debut;
              item.fin = label === 'f' ? date : item.fin;
              item.subdivisions.forEach((item)=>{
                item.debut = label === 'd' ? date : item.debut;
                item.fin = label === 'f' ? date : item.fin;
                item.subdivisions.forEach((item)=>{
                  item.debut = label === 'd' ? date : item.debut;
                  item.fin = label === 'f' ? date : item.fin;
                  item.subdivisions.forEach((item)=>{
                    item.debut = label === 'd' ? date : item.debut;
                    item.fin = label === 'f' ? date : item.fin;
                    item.subdivisions.forEach((item)=>{
                      item.debut = label === 'd' ? date : item.debut;
                      item.fin = label === 'f' ? date : item.fin;
                      item.subdivisions.forEach((item)=>{
                        item.debut = label === 'd' ? date : item.debut;
                        item.fin = label === 'f' ? date : item.fin;
                        item.subdivisions.forEach((item)=>{
                          item.debut = label === 'd' ? date : item.debut;
                        item.fin = label === 'f' ? date : item.fin;
                         })})})})})})})})}})})
    break;
    case 2:
      this.localities.forEach((item)=> {
        item.subdivisions.forEach((item)=>{
          item.subdivisions.forEach((item)=>{
            if(item.id == id){
              item.debut = label === 'd' ? date : item.debut;
              item.fin = label === 'f' ? date : item.fin;

            item.subdivisions.forEach( (item)=>{
              item.debut = label === 'd' ? date : item.debut;
              item.fin = label === 'f' ? date : item.fin;
              item.subdivisions.forEach((item)=>{
                item.debut = label === 'd' ? date : item.debut;
                item.fin = label === 'f' ? date : item.fin;
                item.subdivisions.forEach((item)=>{
                  item.debut = label === 'd' ? date : item.debut;
                  item.fin = label === 'f' ? date : item.fin;
                  item.subdivisions.forEach((item)=>{
                    item.debut = label === 'd' ? date : item.debut;
                    item.fin = label === 'f' ? date : item.fin;
                    item.subdivisions.forEach((item)=>{
                      item.debut = label === 'd' ? date : item.debut;
                      item.fin = label === 'f' ? date : item.fin;
                      item.subdivisions.forEach((item)=>{
                        item.debut = label === 'd' ? date : item.debut;
                         item.fin = label === 'f' ? date : item.fin;
                        item.subdivisions.forEach((item)=>{
                          item.debut = label === 'd' ? date : item.debut;
                          item.fin = label === 'f' ? date : item.fin;
                          })})})})})})})}})})})
    break;
    case 3:
      this.localities.forEach((item)=> {
        item.subdivisions.forEach((item)=>{
          item.subdivisions.forEach((item)=>{
            item.subdivisions.forEach((item)=>{
              if(item.id == id){
                item.debut = label === 'd' ? date : item.debut;
                item.fin = label === 'f' ? date : item.fin;
              item.subdivisions.forEach((item)=>{
                item.debut = label === 'd' ? date : item.debut;
                item.fin = label === 'f' ? date : item.fin;
                item.subdivisions.forEach((item)=>{
                  item.debut = label === 'd' ? date : item.debut;
                  item.fin = label === 'f' ? date : item.fin;
                  item.subdivisions.forEach((item)=>{
                    item.debut = label === 'd' ? date : item.debut;
                    item.fin = label === 'f' ? date : item.fin;
                    item.subdivisions.forEach((item)=>{
                      item.debut = label === 'd' ? date : item.debut;
                      item.fin = label === 'f' ? date : item.fin;
                      item.subdivisions.forEach((item)=>{
                        item.debut = label === 'd' ? date : item.debut;
                        item.fin = label === 'f' ? date : item.fin;
                        item.subdivisions.forEach((item)=>{
                          item.debut = label === 'd' ? date : item.debut;
                          item.fin = label === 'f' ? date : item.fin;
                        })})})})})})}})})})})
    break;
    case 4:
      this.localities.forEach((item)=> {
        item.subdivisions.forEach((item)=>{
          item.subdivisions.forEach((item)=>{
            item.subdivisions.forEach((item)=>{
              item.subdivisions.forEach((item)=>{
                if(item.id == id){
                  item.debut = label === 'd' ? date : item.debut;
                  item.fin = label === 'f' ? date : item.fin;
                item.subdivisions.forEach((item)=>{
                  item.debut = label === 'd' ? date : item.debut;
                  item.fin = label === 'f' ? date : item.fin;
                  item.subdivisions.forEach((item)=>{
                    item.debut = label === 'd' ? date : item.debut;
                    item.fin = label === 'f' ? date : item.fin;
                    item.subdivisions.forEach((item)=>{
                      item.debut = label === 'd' ? date : item.debut;
                      item.fin = label === 'f' ? date : item.fin;
                      item.subdivisions.forEach((item)=>{
                        item.debut = label === 'd' ? date : item.debut;
                        item.fin = label === 'f' ? date : item.fin;
                        item.subdivisions.forEach((item)=>{
                          item.debut = label === 'd' ? date : item.debut;
                           item.fin = label === 'f' ? date : item.fin;})})})})})}})})})})})
    break;
  }
  
console.log(date);

  
};


getParents(loc: LocalityEdit): LocalityEdit[]{

 let parents: LocalityEdit[] = [];

  switch(loc.level){
    case 1:
      this.localities.forEach((item) => {
        if(item.id === loc?.idParent) parents.push(item)
      });
    break;

    case 2:
      this.localities.forEach((loc1) => {
          loc1.subdivisions.forEach((loc2) => {
            if(loc2.id === loc?.idParent){
            parents.push(loc2);
            parents.push(loc1)}
          })});
    break;

    case 3:
      console.log(loc)

      this.localities.forEach((loc1) => {
          loc1.subdivisions.forEach((loc2) => {
              loc2.subdivisions.forEach((loc3) => {
                if(loc3.id === loc?.idParent){
                parents.push(loc2);
                parents.push(loc1);
                parents.push(loc3)}
              })
          })});
    break;

    case 4:
      console.log(loc)
      this.localities.forEach((loc1) => {
          loc1.subdivisions.forEach((loc2) => {
              loc2.subdivisions.forEach( (loc3) => {
                loc3.subdivisions.forEach( (loc4) => {
                  if(loc4.id === loc?.idParent){
                  parents.push(loc2);
                  parents.push(loc1);
                  parents.push(loc3);
                  parents.push(loc4)}
                })
              })
          })});
    break;
    case 5:
      this.localities.forEach((loc1) => {
          loc1.subdivisions.forEach((loc2) => {
              loc2.subdivisions.forEach( (loc3) => {
                loc3.subdivisions.forEach( (loc4) => {
                  loc4.subdivisions.forEach( (loc5) => {
                    if(loc5.id === loc?.idParent){
                    parents.push(loc2);
                    parents.push(loc1);
                    parents.push(loc3);
                    parents.push(loc4);
                    parents.push(loc5)}
                  })
                })
              })
          })});
    break;
  }
  return  parents;
  
}




 doHaveChild(loc: LocalityEdit) : boolean {
   let state : boolean = false;
   let mloc = this.selectedLocalities.find((item) => item.idParent === loc.idParent);
   if(mloc !== undefined){ state = true;}
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
  };
  selected?: boolean;
  opened?: boolean;
  debut?: string;
  fin?: string;
  subdivisions: LocalityEdit[];
  disabled: boolean;


}


