import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/administration/service/admin.service';
import { InventaireService } from 'src/app/inventaire/service/inventaire.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ImmobilisationService } from '../../services/immobilisation.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { RowHeightCache } from '@swimlane/ngx-datatable';
type AOA = any[][];


@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.sass']
})
export class CatalogueComponent implements OnInit {


  @ViewChild('formDirective') private formDirective: NgForm;
  @ViewChild('showImmo', { static: false }) showImmo: TemplateRef<any>;
  data = [];
  selectedRowData: selectRowInterface;
  idCurrentEse;
  details = false


  editForm: FormGroup;


  allCatalogue = [];

  columns = [
    { element: 'Libelle', name: 'libelle', width: 100 },
    { element: 'Marque', name: 'marque', width: 100 },
    { element: 'Reference', name: 'reference', width: 100 }, //ninea,adresse
    { element: 'Specificites', name: 'specifites', width: 100 }, //ninea,adresse
    { element: 'Fournisseur', name: 'fournisseur', width: 100 }, //ninea,adresse
  ];

  constructor(private immoService: ImmobilisationService,
    private adminServ: AdminService,
    private sharedService: SharedService,
    private securityServ: SecurityService,
    private inventaireServ: InventaireService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,) {
    this.editForm = this.fb.group({
      id: [0],
      libelle: [0],
      marque: [''],
      reference: ['',],
      specifites: [''],
      fournisseur: [''],
    });
  }

  ngOnInit(): void {
    this.getCatalogueListe();
  }

  showDialogImmo() {
    this.showImmo.elementRef.nativeElement.click();
  }
  showDetails(row) {
    console.log(row);
    this.details = true
    this.editRow(row, true)
  }

  update(row) {
    this.details = false
    this.editRow(row)
  }

  save() {
    this.securityServ.showLoadingIndicatior.next(true);
    this.sharedService.putElement(this.editForm.value, '/catalogues/' + this.editForm.value.id).then(rep => {
      console.log(rep);

      this.getCatalogueListe();
      this.securityServ.showLoadingIndicatior.next(false);
    });
  }

  delete(row) {
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
        text: "de vouloir supprimer de la liste cette catalogue ." + row.libelle,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, je le veux!',
        cancelButtonText: 'Non, annuler!',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.securityServ.showLoadingIndicatior.next(true);
          this.sharedService.deleteElement('/catalogues/' + row.id).then(rep => {
            console.log(rep);
            this.getCatalogueListe();
            this.securityServ.showLoadingIndicatior.next(false);
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {

        }
      })


    }

  }

  editRow(row, lock = false) {

    if (this.formDirective) this.formDirective.resetForm()
    this.editForm = this.fb.group({
      id: [{ value: row.id, disabled: lock }],
      libelle: [{ value: row.libelle, disabled: lock }],
      marque: [{ value: row.marque, disabled: lock }],
      reference: [{ value: row.reference, disabled: lock },],
      specifites: [{ value: row.specifites, disabled: lock }],
      fournisseur: [{ value: row.fournisseur, disabled: lock }],
    });
    this.selectedRowData = row;


  }

  getCatalogueListe() {
    this.securityServ.showLoadingIndicatior.next(true);
    this.idCurrentEse = localStorage.getItem("currentEse");
    this.sharedService.getElement('/catalogues?entreprise=/api/entreprises/' + this.idCurrentEse).then(rep => {
      this.allCatalogue = rep;
      console.log(rep);

      this.securityServ.showLoadingIndicatior.next(false);
    });
  }

  getAllCatalaogue(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
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
      this.securityServ.showLoadingIndicatior.next(true);


      for await (const iterator of this.data) {
        const obj = {
          libelle: iterator[0],
          entreprise: "api/entreprises/" + this.idCurrentEse,
          marque: iterator[1],
          reference: iterator[2],
          specifites: iterator[3],
          fournisseur: iterator[4]
        }
        // console.log(obj);

        this.sharedService.postElement(obj, '/catalogues').then(rep => console.log(rep))



      }

      this.getCatalogueListe();
      this.securityServ.showLoadingIndicatior.next(false);



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

  deleteCatalogueEntreprise() {
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
          this.securityServ.showLoadingIndicatior.next(true);
          this.sharedService.getElement('/entreprises/catalogues/' + this.idCurrentEse).then(rep => {
            console.log(rep);
            this.getCatalogueListe();
            this.securityServ.showLoadingIndicatior.next(false);
          });
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
  specifites: String,
  fournisseur: string
}
