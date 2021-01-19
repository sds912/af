import { Affectation } from './../../../data/schema/Affectation';
import { PlaningModule } from './../planing.module';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from 'src/app/data/schema/user';

@Injectable({ providedIn: 'root' })
export class AffectationService {
  // Make _puppiesSource private so it's not accessible from the outside, 
  // expose it as puppies$ observable (read-only) instead.
  // Write to _puppiesSource only through specified store methods below.
  private readonly _userSource = new BehaviorSubject<User[]>([]);

  private readonly _userDataSource = new BehaviorSubject<User[]>([]);


  private readonly _myAffectsSource = new BehaviorSubject<any[]>([]);


  private readonly _openedSource = new BehaviorSubject<boolean>(false);
  private readonly _doneSource = new BehaviorSubject<boolean>(false);


  private readonly _editSource = new BehaviorSubject<boolean>(false);

  private readonly _editingSource = new BehaviorSubject<boolean>(false);



  private readonly _DataToSaveSource = new BehaviorSubject<any>(null);

  private readonly _selectedLocalitiesSource = new BehaviorSubject<any>([]);

  



  // Exposed observable (read-only).
  readonly users$ = this._userSource.asObservable();
  readonly opened$ = this._openedSource.asObservable();
  readonly data$ = this._DataToSaveSource.asObservable();
  readonly edit$ = this._editSource.asObservable();
  readonly editing$ = this._editingSource.asObservable();
  readonly done$ = this._doneSource.asObservable();



  readonly myAffects$ = this._myAffectsSource.asObservable();
  readonly userData$ = this._userDataSource.asObservable();
  readonly selectedLocData$ = this._selectedLocalitiesSource.asObservable();







  constructor() {}

  // Get last value without subscribing to the puppies$ observable (synchronously).
  getUsers(): User[] {
    return this._userSource.getValue();
  }

  private _setUsers(users: User[]): void {
    this._userSource.next(users);
  }

  private _setEditing(state: boolean): void {
    this._editingSource.next(state);
  }

  private _setDone(state: boolean): void {
    this._doneSource.next(state);
  }

  private _setUserData(users: User[]): void {
    this._userDataSource.next(users);
  }


  private _setSelectedLocs(locs: any[]): void {
    this._selectedLocalitiesSource.next(locs);
  }

  

  private _setAffect(affects: any[]): void {
    this._myAffectsSource.next(affects);
  }

  private _setOpened(state: boolean): void {
    this._openedSource.next(state);
  }

  private _setEdit(state: boolean): void {
    this._openedSource.next(state);
  }

  private _setData(data): void {
    this._DataToSaveSource.next(data);
  }

  addUser(users: User[]): void {
    this._setUsers(users);
    
  }


  editUsers(user: User){
   
  }


  addUserData(users: User[]): void {
    this._setUserData(users);
    
  }

  addSelectedLoc(locs: any[]): void {
    this._setSelectedLocs(locs);
    
  }

  toogle(state: boolean){
    this._setOpened(state);
  }

  editing(state: boolean){
    this._setEdit(state);
  }

  addAffect(affects: any[]){
    this._setAffect(affects);
  }

  isEditing(state: boolean){
    this._setEditing(state);
  }



  isDone(state: boolean){
    this._setDone(state);
  }



  setData(data: any){
    this._setData(data);
  }

  removeUser(user: User): void {
    const users = this.getUsers().filter(p => p.id !== user.id);
    this._setUsers(users);
  }

  adoptUser(user: User): void {
    const users = this.getUsers().map(p =>
      p.id === user.id ? { ...p, ...{ selected: true } } : p
    );
    this._setUsers(users);
  }
}