import { Component, OnInit, ViewChild  , ElementRef} from '@angular/core';
import { ImmobilisationService } from '../../services/immobilisation.service';
import { AdminService } from 'src/app/administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';

@Component({
  selector: 'app-immobilisation',
  templateUrl: './immobilisation.component.html',
  styleUrls: ['./immobilisation.component.sass']
})
export class ImmobilisationComponent implements OnInit {

  data = [] ; 

  @ViewChild('openFileUload', { static: false }) openFileUload;


  constructor(private immoService: ImmobilisationService,
    private adminServ: AdminService,
    private sharedService: SharedService,
    private securityServ: SecurityService
  ) { }

  ngOnInit(): void {
    this.securityServ.showLoadingIndicatior.next(false); 
  }

  getAllImmos() {
   
      
    
  }


}
