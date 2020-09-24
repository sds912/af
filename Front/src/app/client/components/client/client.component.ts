import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators,NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { IMAGE64 } from 'src/app/administration/components/entreprise/image';
import { AdminService } from 'src/app/administration/service/admin.service';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.sass']
})
export class ClientComponent implements OnInit {
  @ViewChild('roleTemplate', { static: true }) roleTemplate: TemplateRef<any>;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('closeAddModal', { static: false }) closeAddModal;
  @ViewChild('closeEditModal', { static: false }) closeEditModal;
  @ViewChild('formDirective') private formDirective: NgForm;
  totalMessage="Total"
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
  image:string=IMAGE64;
  fileToUploadPp:File=null;
  defaultImag=IMAGE64
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
      telephone: [''],
      nomContact: [''],
      telContact: [''],
      nombre: [0],
      cle: [''],
      baseHash: [''],
      adresse: [''],
      dateCreation: ['']
    });
    this.imgLink=this.sharedService.baseUrl +"/images/"
    this.newUserImg = this.imgLink+this.defaultImag;
  }
  ngOnInit() {    
    this.securityServ.showLoadingIndicatior.next(true)
    this.getClients()
  }
  getClients(){
    this.adminServ.getClients().then(
      rep=>{
        console.log(rep);
        
        this.securityServ.showLoadingIndicatior.next(false)
        let e=rep
        if(e?.length>0)e=rep.reverse()
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
      telephone: [{value: row.telephone, disabled: lock}, [Validators.required]],
      nomContact: [{value: row.nomContact, disabled: lock}],
      telContact: [{value: row.telContact, disabled: lock}],
      nombre: [{value: row.nombre, disabled: lock}],
      cle: [{value: row.cle, disabled: lock}],
      baseHash: [{value: row.baseHash, disabled: lock}],
      adresse: [{value: row.adresse, disabled: lock}],
      dateCreation: [{value: row.dateCreation, disabled: lock}]
    });
    this.selectedRowData = row;
  }
  longText(text,limit){
    return this.sharedService.longText(text,limit)
  }
  update(row){
    this.details=false
    this.image=""
    this.editRow(row)
  }
  showDetails(row){
    this.details=true
    this.editRow(row, true)
  }
  addRow() {
    this.image=""
    this.details=false
    const rdm=Math.floor(Math.random()*10001)
    const base="FA-"+rdm.toString();
    let entreprise:any={id:0,denomination:'',telephone:'',nomContact:'',telContact:'',nombre:0,adresse:'',cle:'',baseHash:base,image:this.defaultImag,dateCreation: new Date().toISOString()}
    this.editRow(entreprise)
  }
  onEditSave(form: FormGroup) {
    this.securityServ.showLoadingIndicatior.next(true)
    let data=form.value
    data.image=this.image!=""?this.image:IMAGE64
    console.log(data);
    this.adminServ.addClient(data).then(
      ()=>{
        this.securityServ.showLoadingIndicatior.next(false)
        this.showNotification('bg-success','Enregistré','top','center')
        this.closeEditModal.nativeElement.click();
        this.getClients()
      },message=>{
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(message)
        this.showNotification('bg-red',message,'top','right')
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
      panelClass: [colorName,'color-white']
    });
  }
  changeNombreEntit(nombre){
    this.editForm.get('cle').setValue(
      this.codeK(this.selectedRowData.baseHash,nombre)
    )
  }
  codeK(base,nmbr){//ne pas mettre dans shared car il ne doit pas faire partie des modules lors d'un deploiement
    const n=(parseInt(nmbr)*5+9999)+parseInt(base.split("-")[1])
    const rdm=Math.floor(Math.random()*20)
    const frst=this.sharedService.tabAZ(rdm)
    const snd=this.sharedService.tabAZ(rdm+2)
    const th=this.sharedService.tabAZ(rdm+5)
    return frst+snd+th+"-"+n+"-"+rdm+"-"+(n*4+17)
  }
}
export interface selectRowInterface {
  image: String;
  denomination: String;
  republique: String;
  baseHash: String;
  cle: String;
}