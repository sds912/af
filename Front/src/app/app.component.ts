import { Component } from '@angular/core';
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
  RouterEvent
} from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SecurityService } from './shared/service/security.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUrl: string;
  showLoadingIndicatior = true;
  jwtHelper = new JwtHelperService();
  detruit:boolean=false;
  constructor(public _router: Router, location: PlatformLocation,public securityService: SecurityService,public router:Router) {
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
    if(localStorage.getItem('token')){
      this.securityService.load();
    }
    this.tokenExpire();
    this.shortWidth()
  }
  tokenExpire(){
    const token=localStorage.getItem('token')
    if(localStorage.getItem('token') && this.jwtHelper.isTokenExpired(token)){
      localStorage.clear();
      window.location.reload();
    }
  }
  shortWidth(){
    if(window.innerWidth<600){
      this.securityService.logOut();
    }
  }
}
