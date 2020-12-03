import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/data/schema/user';
import { Roles } from 'src/app/data/constants/roles';


@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private _currentUser: User;

  constructor(private http: HttpClient) {
    this._currentUser = JSON.parse(localStorage.getItem('currentUser')) as User;
  }

  public get info() : any {
    return this._currentUser;
  }

  public get roles() : string[] {
    return this._currentUser.roles;
  }

  public get isAdmin() {
    return this._currentUser && this._currentUser.roles.indexOf(Roles.ROLE_ADMIN) > -1;
  }

  public get isGuest() {
    return this._currentUser && this._currentUser.roles.indexOf(Roles.ROLE_GUEST) > -1;
  }

  public get isSuperviseur() {
    return this._currentUser && this._currentUser.roles.indexOf(Roles.ROLE_SUPERVISEUR) > -1;
  }

  public get isSuperviseurGeneral() {
    return this._currentUser && this._currentUser.roles.indexOf(Roles.ROLE_SUPERVISEUR_GENERAL) > -1;
  }

  public get isSuperviseurAdjoint() {
    return this._currentUser && this._currentUser.roles.indexOf(Roles.ROLE_SUPERVISEUR_ADJOINT) > -1;
  }

  public get isChefEquipe() {
    return this._currentUser && this._currentUser.roles.indexOf(Roles.ROLE_CHEF_EQUIPE) > -1;
  }

  public get isMembreEquipe() {
    return this._currentUser && this._currentUser.roles.indexOf(Roles.ROLE_MEMBRE_EQUIPE) > -1;
  }

  public get isPresidentComite() {
    return this._currentUser && this._currentUser.roles.indexOf(Roles.ROLE_PRESIDENT_COMITE) > -1;
  }

  public get isMembreComite() {
    return this._currentUser && this._currentUser.roles.indexOf(Roles.ROLE_MEMBRE_COMITE) > -1;
  }


  public  getLiensMenu() {
    let url = '';
    switch (true) {
      case this.isAdmin:
        url = '../assets/data/json/menuAd.json';
        break;

      case this.isSuperviseur:
        url = '../assets/data/json/menuSup.json';
        break;

      case this.isSuperviseurGeneral:
        url = '../assets/data/json/menuExp.json';
        break;

      case this.isSuperviseurAdjoint:
        url = '../assets/data/json/menuAdh.json';
        break;

      default:
        break;
    }
    return this.http.get(url);
}
}
