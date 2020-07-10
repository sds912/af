import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from 'src/app/shared/service/security.service';

@Injectable({
  providedIn: 'root'
})
//ng generate guard core/guard/noAuth
export class AdminGuard implements CanActivate {
  constructor(private router: Router,private securityService:SecurityService){ }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {//il va return soit un  Observable qui sera de type boolean soit ...un observable est un objet qui emmet des infos dans le temps
    if(!this.securityService.admin && !this.securityService.guest){
        this.router.navigateByUrl("");
        return false;
    }
    return true;
}
}
