import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SecurityService } from 'src/app/shared/service/security.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector:Injector) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let securityService=this.injector.get(SecurityService)
    let tokenizedReq=request.clone({
      setHeaders:{
        Authorization: `Bearer ${securityService.token}`,
        'Accept': 'application/json',
      }
    })
    return next.handle(tokenizedReq)
  }
}
