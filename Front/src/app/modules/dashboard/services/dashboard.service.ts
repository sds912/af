import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private sharedService: SharedService) { }

  getData(idInventaire: string, idEntreprise: string) {
    return this.sharedService.postElement({inventaire: idInventaire, entreprise: idEntreprise}, '/dashbord');
  }
}
