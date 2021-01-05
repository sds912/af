import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Entreprise } from 'src/app/data/schema/entreprise';
import { User } from 'src/app/data/schema/user';
import { EntrepriseService } from 'src/app/data/services/entreprise/entreprise.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { environment } from 'src/environments/environment';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-personnels',
  templateUrl: './personnels.component.html',
  styleUrls: ['./personnels.component.sass']
})
export class PersonnelsComponent implements OnInit {
  dep = [
    'Direction financière',
    'Direction comptable',
    'Direction du patrimoine',
    'Autre (à préciser)'
  ];
  apiImageUrl = `${environment.apiUrl}/images/`;

  idCurrentEse: number;
  show: boolean;
  entreprises: Entreprise[];
  personnels: User[];

  constructor(
    private entrepriseService: EntrepriseService,
    private adminService: AdminService,
    public securityService: SecurityService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.idCurrentEse = null;
    this.personnels = [];
    this.entreprises = [];
    this.getEntreprises();
    this.getUsers();
  }

  getEntreprises() {
    this.adminService.getEntreprise().then(
      rep => {
        this.entreprises = rep
        if (rep && rep.length == 1) {
          this.idCurrentEse = rep[0].id;
        }
      },
      error => {
        this.securityService.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }

  getUsers() {
    let filters = 'status=OUT';
    if (this.idCurrentEse != null) {
      filters = `status=OUT&entreprise=${this.idCurrentEse}`
    }
    this.adminService.getUsers(filters).then(
      (rep: any) => {
        this.personnels = rep as Entreprise[];
        this.show = true;
        this.securityService.showLoadingIndicatior.next(false)
      },
      error => {
        console.log(error)
        this.securityService.showLoadingIndicatior.next(false)
      }
    )
  }

  entiteChange(id) {
    if (id == '') {
      id = null;
    }
    this.idCurrentEse = id;
    this.getUsers();
  }

  uploadPersonnels(evt: any) {
    if (!this.idCurrentEse) {
      this.showNotification('bg-danger', 'Veuillez choisir une entreprise', 'top', 'center');
      evt.target.value = '';
      return;
    }
    console.log('do');
    let fileList: FileList = evt.target.files;
    let fileUpload: File = fileList[0];
    const formData = new FormData();
    formData.append('file', fileUpload, fileUpload.name);
    formData.append('table', 'agents');
    formData.append('entreprise', `${this.idCurrentEse || ''}`);
    this.entrepriseService.importAgents(formData).subscribe((res: any) => {
      this.showNotification('bg-info', res, 'top', 'center');
      evt.target.value = '';
      setTimeout(() => {
        this.getUsers();
      }, 2000);
    }, error => evt.target.value = '');
  }

  removeUser(user) {
    console.log(user);
  }

  showNotification(colorName, text, placementFrom, placementAlign, duree = 2000) {
    this._snackBar.open(text, '', {
      duration: duree,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: [colorName, 'color-white']
    });
  }
}
