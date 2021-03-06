import { NgModule, Optional, SkipSelf  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guard/auth.guard';
import { SupervAdminGuard } from './guard/superv-admin.guard';
import { AdminGuard } from './guard/admin.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { SuperviseurAndCE } from './guard/superviseurAndCE.guard ';
import { AuthInterceptor } from './interceptor/auth.Interceptor';
import { RoleGuard } from './guard/role.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    SupervAdminGuard,
    AdminGuard,
    SuperviseurAndCE,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {//pour eviter qu'on le charge à plusieurs endroits
  if (parentModule) { 
     throw new Error('CoreModule is already loaded.'); 
    } 
  }
 }
