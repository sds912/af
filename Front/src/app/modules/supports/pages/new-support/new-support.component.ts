import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { diffDates } from '@fullcalendar/core';
import { AdminService } from 'src/app/modules/administration/service/admin.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-new-support',
  templateUrl: './new-support.component.html',
  styleUrls: ['./new-support.component.sass']
})
export class NewSupportComponent implements OnInit {

  ticketTypes: any[];
  ticketForm: FormGroup;
  error: string;
  isLoading: boolean;
  submitted = false;

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  files  = []; 

  constructor(
    private formBuilder: FormBuilder,
    private supportService: SupportService,
    private adminService: AdminService,
    private securityService: SecurityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ticketTypes = [
      'Phase préparatoire',
      'Phase méthodologique et de planification',
      'Phase de réalisation des travaux de comptage et de traitement des données',
      'Phase d’ajustement du fichier des immobilisations', 'Autres'
    ];
    this.buildForm();
  }

  get f () {
    return this.ticketForm.controls;
  }

  saveTicket() {
    this.submitted = true;
    this.isLoading = true;

    // stop here if form is invalid
    if (this.ticketForm.invalid) {
      return;
    }
    let newTicket = this.ticketForm.value;

    if (this.securityService.admin) {
      newTicket.entreprise = {id: null, denomination: null};
      this.createTicket(this.securityService.user.cle, newTicket);
    } else {
      this.adminService.getOneEntreprise(localStorage.getItem("currentEse")).then((entreprise: any) => {
        if (!entreprise || !entreprise.id) {
          return;
        }

        newTicket.entreprise = {id: entreprise.id, denomination: entreprise.denomination};
        this.createTicket(entreprise.license.licenseCle, newTicket);
      });
    }
  }

  createTicket(licenseCle: string, newTicket: any) {
    newTicket.licence = licenseCle;
      newTicket.piecesJointes = this.files;
      newTicket.auteur = {id: localStorage.getItem("idUser"), username: localStorage.getItem("username"), roles: localStorage.getItem("roles")};

      this.supportService.create(newTicket).subscribe((data: any) => {
        if (data && data.id) {
          this.router.navigate(['/supports/lists']);
        }
      });
  }

  private buildForm(): void {

    //supports@asma-technologies.fr
    //asmatechnologie2020
    const fields = {
      type: ['', Validators.required],
      objet: ['',  Validators.required],
      description: ['',  Validators.required]
    }

    this.ticketForm = this.formBuilder.group(fields);
  }

  onClick() {  
    const fileUpload = this.fileUpload.nativeElement;  
    fileUpload.click();  
  }

  changeListener() : void {
    const filesUploads = this.fileUpload.nativeElement.files;
    this.files = [];

    for (let i = 0; i < filesUploads.length; i++) {
      let myReader:FileReader = new FileReader();
      myReader.onloadend = (e) => {
        this.files.push(myReader.result);
      }
      myReader.readAsDataURL(filesUploads[i]);
    }
  }
}
