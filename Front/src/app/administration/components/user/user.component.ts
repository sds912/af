import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { Entreprise } from '../../model/entreprise';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {
  @ViewChild('roleTemplate', { static: true }) roleTemplate: TemplateRef<any>;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('closeAddModal', { static: false }) closeAddModal;
  @ViewChild('closeEditModal', { static: false }) closeEditModal;
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
  defaultImag="exemple.jpg"
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar,private adminServ:AdminService,private sharedService:SharedService) {
    this.editForm = this.fb.group({
      id: [0],
      image: [''],
      denomination: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      republique: [''],
      ville: [''],
      ninea: [''],
      adresse: ['']
    });
    this.imgLink=this.sharedService.baseUrl +"/images/"
    this.newUserImg = this.imgLink+this.defaultImag;
  }
  ngOnInit() {
    this.getEntreprise()
  }
  getEntreprise(){
    this.adminServ.getEntreprise().then(
      rep=>{
        console.log(rep)
        this.data = rep;
        this.filteredData = rep;
        this.show=true
      },
      error=>console.log(error)
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

  editRow(row, rowIndex=0) {
    this.editForm.setValue({
      id: row.id,
      denomination: row.denomination,
      republique: row.republique,
      ville: row.ville,
      ninea:row.ninea,
      adresse:row.adresse,
      image: row.image
    });
    this.selectedRowData = row;
  }
  addRow() {
    let entreprise:Entreprise={id:0,denomination:'',republique:'',ville:'',ninea:'',adresse:'',image:this.defaultImag}
    this.editRow(entreprise)
  }
  deleteRow(row) {
    this.data = this.arrayRemove(this.data, row.id);
    this.showNotification(
      'bg-red',
      'Delete Record Successfully',
      'bottom',
      'right'
    );
  }
  arrayRemove(array, id) {
    return array.filter(function(element) {
      return element.id != id;
    });
  }
  onEditSave(form: FormGroup) {
    let data=form.value
    data.image=this.fileToUploadPp
    this.adminServ.addEntreprise(data).then(
      rep=>{
        this.showNotification('bg-success','Edit Record Successfully','bottom','center')
        this.closeEditModal.nativeElement.click();
        this.getEntreprise()
      },message=>{
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
  getId(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
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
