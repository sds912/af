import { Affectation } from './../../../../data/schema/Affectation';
import { AffectationService } from './../../services/affectation.service';
import { User } from './../../../../data/schema/user';
import { Component, Input, OnInit } from '@angular/core';
import { PlaningService } from '../../services/planing.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.sass']
})
export class UserListComponent implements OnInit {

  users: User[] ;
  selectedUsers: User[];
  filteredUsers: User[];
  display: boolean = false;
  displayeduser: User;
  @Input() inventaire: any;
  @Input() subdivisions: string[];
  myAffectations: any[];
  currentRoles: string;
  myAffectToString: string[] = [];
  EditingUserNameAndRole: string = "";
  


r3: string[] = ['ROLE_MC', 'ROLE_MI', 'ROLE_ME'];



  constructor(private affectationService: AffectationService, private planningService: PlaningService) { 
  
  }

  ngOnInit(): void {
    this.filteredUsers = [];
    this.currentRoles = localStorage.getItem('roles');
    
    this.affectationService.userData$.subscribe((users) => {
      this.users = users;
    })
}


  getSelected(id: string){
    this.affectationService.addUser(this.selectedUsers)
  }


  getRole(role, show = true):string {
    let r1 = '', r2 = ''
    if (role && (role == 'Superviseur' || role[0] == "ROLE_Superviseur")) {
      r1 = 'Superviseur'
      r2 = "ROLE_Superviseur"
    }
    else if (role && (role == 'Superviseur général' || role[0] == "ROLE_SuperViseurGene")) {
      r1 = 'Superviseur général'
      r2 = "ROLE_SuperViseurGene"
    }
    else if (role && (role == 'Superviseur adjoint' || role[0] == "ROLE_SuperViseurAdjoint")) {
      r1 = 'Superviseur adjoint'
      r2 = "ROLE_SuperViseurAdjoint"
    } else if (role && (role == 'Guest' || role[0] == "ROLE_Guest")) {
      r1 = 'Guest'
      r2 = "ROLE_Guest"
    } else if (role && (role == 'Président du comité' || role[0] == "ROLE_PC")) {
      r1 = 'Président du comité'
      r2 = "ROLE_PC"
    } else if (role && (role == 'Membre du comité' || role[0] == "ROLE_MC")) {
      r1 = 'Membre du comité'
      r2 = "ROLE_MC"
    } else if (role && (role == "Chef d'équipe" || role[0] == "ROLE_CE" || role == "Chef d'équipe de comptage")) {
      r1 = "Chef d'équipe de comptage"
      r2 = "ROLE_CE"
    } else if (role && (role == "Membre inventaire" || role[0] == "ROLE_MI" || role == "Membre d'équipe de comptage")) {
      r1 = "Membre d'équipe de comptage"
      r2 = "ROLE_MI"
    }
    if (show) return r1
    return r2
  }


  filterDatatable(value) {
    // get the value of the key pressed and make it lowercase
   const val = value.toLowerCase();
   this.filteredUsers =  this.users.filter((item) => {
    return item.nom.toString().toLowerCase().startsWith(val);
    });

}








edit(user: any) {
 this.affectationService.addUser([user]);
 this.affectationService.editing(true);
 this.getAffectationOf(user);
 this.affectationService.myAffects$.subscribe((val) => {
   let list: any[] = [];
   val.forEach((item) => list.push(item.localite));

   this.affectationService.addSelectedLoc(list);
 })
}


filterByRole(role: string): boolean {
  let pass: boolean = false;


  if(this.currentRoles == 'ROLE_SuperViseurGene'){


   if(role == 'ROLE_SuperViseurAdjoint'){

    pass = true;

   }else{
     pass = false;
   }

  }

  if(this.currentRoles == 'ROLE_SuperViseurAdjoint'){

    if(role == "ROLE_CE"){
 
     pass = true;
 
    }else{
      pass = false;
    }
 
   }

   if(this.currentRoles == 'ROLE_CE'){

    if(this.r3.includes(role)){
 
     pass = true;
 
    }else{
      pass = false;
    }
 
   }

   return pass;
}




getAffectationOf(user){
  /** L'affectation d'un utilisateur */
  this.planningService.getAffectations(`?user.id=${user.id}&inventaire.id=${this.inventaire?.id}`).then(
    res=>{
      this.myAffectations = res;
      this.affectationService.addAffect(res);
      this.displayLevel(res);
      }
    ,error=>{
      console.log(error)
    }
  )
}


displayLevel(users: any[]) {
 this.EditingUserNameAndRole = "Affectations de " + users[0].user.nom + " " + this.getRole(users[0].user.roles);
  this.myAffectToString = [];
  users.forEach((item) => {
    if(item.localite.level === this.subdivisions.length - 1)  {
      this.myAffectToString.push(item.localite.arborescence);
      this.display = true;

    }})
  


}







}