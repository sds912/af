import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ImmobilisationService } from '../../services/immobilisation.service';
import { AdminService } from 'src/app/administration/service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import * as XLSX from 'xlsx';
import { InventaireService } from 'src/app/inventaire/service/inventaire.service';
type AOA = any[][];

@Component({
  selector: 'app-immobilisation',
  templateUrl: './immobilisation.component.html',
  styleUrls: ['./immobilisation.component.sass']
})
export class ImmobilisationComponent implements OnInit {

  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  data = [];

  idCurrentInv;

  idCurrentEse;
  inventaires = [];

  @ViewChild('openFileUload', { static: false }) openFileUload;


  constructor(private immoService: ImmobilisationService,
    private adminServ: AdminService,
    private sharedService: SharedService,
    private securityServ: SecurityService,
    private inventaireServ: InventaireService,
  ) { }

  ngOnInit(): void {
    this.getInventaireByEse();
    this.securityServ.showLoadingIndicatior.next(false);
  }

  getInventaireByEse() {
    this.idCurrentEse=localStorage.getItem("currentEse")
    this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(rep => {
      this.inventaires = rep
    }, error => {
      this.securityServ.showLoadingIndicatior.next(false);
      console.log(error)
    })
  }
  inventaireChange(event : any){
    console.log(event);
  }

  getAllImmos(evt: any) {

    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      for (const iterator of this.data) {
        console.log(iterator);
        
      }


    };
    reader.readAsBinaryString(target.files[0]);
  }


}
