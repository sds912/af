import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/modules/administration/service/admin.service';
import { InventaireService } from 'src/app/data/services/inventaire/inventaire.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ImmobilisationService } from 'src/app/data/services/immobilisation/immobilisation.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { RowHeightCache } from '@swimlane/ngx-datatable';
import { EntrepriseService } from 'src/app/data/services/entreprise/entreprise.service';
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
    private _snackBar: MatSnackBar,
    private entrepriseService: EntrepriseService
  ) {
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
    // @TODO::Prévoir la pagination back pour avoir la liste des catalogues
    this.securityServ.showLoadingIndicatior.next(true);
    this.idCurrentEse = localStorage.getItem("currentEse");
    this.sharedService.getElement('/catalogues?entreprise=/api/entreprises/' + this.idCurrentEse).then(rep => {
      this.allCatalogue = rep;
      console.log(rep);

      this.securityServ.showLoadingIndicatior.next(false);
    });
  }

  getAllCatalaogue(evt: any) {
    let fileList: FileList = evt.target.files;
    let fileUpload: File = fileList[0];
    const formData = new FormData();
    formData.append('file', fileUpload, fileUpload.name);
    formData.append('table', 'catalogues');
    formData.append('entreprise', this.idCurrentEse.toString());
    this.entrepriseService.importCatalogues(formData).subscribe((response) => {
      this.showNotification('bg-info', response, 'top', 'center');
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    });
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
