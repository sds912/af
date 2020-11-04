import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/administration/service/admin.service';
import { InventaireService } from 'src/app/inventaire/service/inventaire.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ImmobilisationService } from '../../services/immobilisation.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
type AOA = any[][];


@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.sass']
})
export class CatalogueComponent implements OnInit {

  data = [];
  selectedRowData: selectRowInterface;
  idCurrentEse;

  constructor(private immoService: ImmobilisationService,
    private adminServ: AdminService,
    private sharedService: SharedService,
    private securityServ: SecurityService,
    private inventaireServ: InventaireService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,) { 
    
  }

  ngOnInit(): void {
    this.idCurrentEse = localStorage.getItem("currentEse")
  }

  getAllCatalaogue(evt: any) {
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
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }));

      console.log(this.data);

      // Verification

      this.data.shift();
      console.log(this.data);
      

    };
    reader.readAsBinaryString(target.files[0]);
  
  }

  showNotification(colorName, text, placementFrom, placementAlign, duree = 2000) {
    this._snackBar.open(text, '', {
      duration: duree,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: [colorName, 'color-white']
    });
  }

  deleteCatalogueInventaire() {
    if (this.idCurrentEse == undefined) {
      this.showNotification('bg-red', 'Selectionner une Entité', 'top', 'center')
    } else {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',

        },
        buttonsStyling: true
      })

      swalWithBootstrapButtons.fire({
        title: 'Ê' + 'TES-VOUS SURE ?'.toLowerCase(),
        text: "de vouloir supprimer la liste des catalogues.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, je le veux!',
        cancelButtonText: 'Non, annuler!',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {

        }
      })


    }
  }

}

export interface selectRowInterface {
  libelle: String;
  marque: String;
  reference: String,
  Specificites: String,
  Fournisseur: string
}
