import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder, FormControl, Validators,NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdminService } from '../../../administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { InventaireService } from '../../service/inventaire.service';

@Component({
  selector: 'app-inventaire',
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.sass']
})
export class InventaireComponent implements OnInit {
  imgLink=""
  inventaires=[]
  idCurrentInv=0
  show=false
  constructor(private fb: FormBuilder, 
              private _snackBar: MatSnackBar,
              private adminServ:AdminService,
              private sharedService:SharedService,
              private securityServ:SecurityService,
              private inventaireServ:InventaireService) {
    this.imgLink=this.sharedService.baseUrl +"/images/"
  }
  
  ngOnInit() {
    this.securityServ.showLoadingIndicatior.next(true)
    this.getInventaire()
  }
  getInventaire(){
    this.inventaireServ.getInventaire().then(
      rep=>{
        console.log(rep)
        this.securityServ.showLoadingIndicatior.next(false)
        let inv=rep
        if(inv && inv.length>0){
          inv=rep.reverse()
          this.idCurrentInv=inv[0].id
        }
        this.inventaires=inv
        this.show=true
      },
      error=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['bg-red']
    });
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this._snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: [colorName,'color-white']
    });
  }
}
