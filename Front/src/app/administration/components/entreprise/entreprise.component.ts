import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder, FormControl, Validators,NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { Entreprise } from '../../model/entreprise';
@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.sass']
})
export class EntrepriseComponent implements OnInit {
  @ViewChild('roleTemplate', { static: true }) roleTemplate: TemplateRef<any>;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('closeAddModal', { static: false }) closeAddModal;
  @ViewChild('closeEditModal', { static: false }) closeEditModal;
  @ViewChild('formDirective') private formDirective: NgForm;
  rows = [];
  selectedRowData: selectRowInterface;
  newUserImg = '';
   
  data = [];
  filteredData = [];
  editForm: FormGroup;
  selectedOption: string;
  columns = [
    { element:'denomination',name: 'Dénomination',width:100 },
    { element:'republique',name: 'République',width:100 },
    { element:'ville',name: 'Ville',width:100 }//ninea,adresse
  ];
  show=false
  imgLink=""
  image:string;
  fileToUploadPp:File=null;
  defaultImag="exemple2.png"
  details=false
  constructor(private fb: FormBuilder, 
              private _snackBar: MatSnackBar,
              private adminServ:AdminService,
              private sharedService:SharedService,
              private securityServ:SecurityService) {
    this.editForm = this.fb.group({
      id: [0],
      image: [''],
      denomination: ['', [Validators.required]],
      republique: [''],
      sigleUsuel: [''],
      ville: [''],
      ninea: [''],
      adresse: ['']
    });
    this.imgLink=this.sharedService.baseUrl +"/images/"
    this.newUserImg = this.imgLink+this.defaultImag;
  }
  ngOnInit() {
    this.securityServ.showLoadingIndicatior.next(true)
    this.getEntreprise()
  }
  getEntreprise(){
    this.adminServ.getEntreprise().then(
      rep=>{
        console.log(rep)
        this.securityServ.showLoadingIndicatior.next(false)
        let e=rep
        if(e && e.length>0)e=rep.reverse()
        this.data = e;
        this.filteredData = rep;
        this.show=true
      },
      error=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }
  handleFileInputPP(file:FileList){
    this.fileToUploadPp=file.item(0);
    var reader=new FileReader();
    reader.onload=(event:any)=>{
      this.image=event.target.result;
    }
    reader.readAsDataURL(this.fileToUploadPp);
  }
  editRow(row,lock=false) {
    if(this.formDirective)this.formDirective.resetForm()
    this.editForm = this.fb.group({
      id: [{value: row.id, disabled: lock}],
      image: [{value: row.image, disabled: lock}],
      denomination: [{value: row.denomination, disabled: lock}, [Validators.required]],
      republique: [{value: row.republique, disabled: lock}],
      sigleUsuel: [{value: row.sigleUsuel, disabled: lock}],
      ville: [{value: row.ville, disabled: lock}],
      ninea: [{value: row.ninea, disabled: lock}],
      adresse: [{value: row.adresse, disabled: lock}]
    });
    this.selectedRowData = row;
  }
  longText(text,limit){
    return this.sharedService.longText(text,limit)
  }
  update(row){
    this.details=false
    this.editRow(row)
  }
  showDetails(row){
    this.details=true
    this.editRow(row, true)
  }
  addRow() {
    this.image=""
    this.details=false
    let entreprise:Entreprise={id:0,denomination:'',sigleUsuel:'',republique:'',ville:'',ninea:'',adresse:'',image:this.defaultImag}
    this.editRow(entreprise)
  }
  onEditSave(form: FormGroup) {
    this.securityServ.showLoadingIndicatior.next(true)
    let data=form.value
    data.image=this.fileToUploadPp
    this.adminServ.addEntreprise(data).then(
      rep=>{
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-success','Enregistré','bottom','center')
        this.closeEditModal.nativeElement.click();
        this.getEntreprise()
      },message=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(message)
        this.showNotification('bg-red',message,'bottom','right')
      }
    )
  }
  filterDatatable(event) {
    // get the value of the key pressed and make it lowercase
    const val = event.target.value.toLowerCase();
    // get the amount of columns in the table
    const colsAmt = this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);
    // assign filtered matches to the active datatable
    this.data = this.filteredData.filter(function(item) {
      // iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        // check for a match
        if (
          item[keys[i]]
            .toString()
            .toLowerCase()
            .indexOf(val) !== -1 ||
          !val
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
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
      panelClass: colorName
    });
  }
}
export interface selectRowInterface {
  image: String;
  denomination: String;
  republique: String;
}