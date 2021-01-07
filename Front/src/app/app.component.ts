import { Component } from '@angular/core';
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
} from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { SecurityService } from './shared/service/security.service';
import { AuthenticationService } from './data/services/authentication/authentication.service';
import { InventaireService } from 'src/app/data/services/inventaire/inventaire.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUrl: string;
  showLoadingIndicatior = true;
  detruit:boolean=false;
  idCurrentInv: any;
  inventaires: any[];

  constructor(
    public _router: Router,
    location: PlatformLocation,
    public securityService: SecurityService,
    public router:Router,
    private authenticationService: AuthenticationService,
    private inventaireService: InventaireService
  ) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.showLoadingIndicatior = true;
        location.onPopState(() => {
          window.location.reload();
        });
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        this.showLoadingIndicatior = false;
        this.securityService.guestAccess(routerEvent.url)
      }
      window.scrollTo(0, 0);
    });
  }
  
  ngOnInit(){
    this.inventaires = [];
    this.idCurrentInv = localStorage.getItem('currentInv');
    if (this.authenticationService.isAuthenticated()) {
      this.getInventaires();
    }
    if(localStorage.getItem('token')){
      this.securityService.load();
    }
    this.shortWidth();
  }

  getInventaires() {
    this.inventaireService.getInventaireByEse(localStorage.getItem('currentEse')).then((res) => {
      this.inventaires = res;
      if ((this.idCurrentInv == 'undefined' || this.idCurrentInv == null) && this.inventaires && this.inventaires.length == 1) {
        localStorage.setItem('currentInv', this.inventaires[0]?.id);
        this.idCurrentInv = localStorage.getItem('currentInv');
      }
    })
  }

  inventaireChange(value) {
    localStorage.setItem('currentInv', value);
    window.location.reload();
  }

  shortWidth(){
    if(window.innerWidth<600){
      this.securityService.logOut();
    }
  }
}
