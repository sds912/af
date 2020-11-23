import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private sharedService: SharedService) { }

  getData(idInventaire: string) {
    return this.sharedService.postElement({id: idInventaire}, '/dashbord');
  }
}
