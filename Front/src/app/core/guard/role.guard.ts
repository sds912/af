import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/data/services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {
  
  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.verifAccess(state, route);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.verifAccess(state, route);
  }

  verifAccess(state: RouterStateSnapshot, route: ActivatedRouteSnapshot) {
    if (route.data.roles && this.authService.currentUserValue) {
      const intersection = route.data.roles.filter(element => this.authService.currentUserValue.roles.includes(element));
      console.log('guard');
      if(intersection.length <= 0) {
        // role not authorised so redirect to home page
        this.router.navigate([ '/auth/access-denied' ], { queryParams: { deniedUrl: state.url }});
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
