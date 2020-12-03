import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/modules/administration/service/admin.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-list-supports',
  templateUrl: './list-supports.component.html',
  styleUrls: ['./list-supports.component.sass']
})
export class ListSupportsComponent implements OnInit {

  tickets: any[];
  
  displayedColumns: string[] = ['numero', 'startDate', 'type', 'objet', 'entreprise', 'auteur', 'status'];
  
  inventaires = [];
  idUser: string;

  constructor(
    private supportService: SupportService,
    private adminService: AdminService,
    private securityService: SecurityService
  ) { }

  ngOnInit(): void {
    this.tickets = [];
    console.log(this.securityService.user);
    this.idUser = localStorage.getItem("idUser");
    if (this.securityService.admin) {
      this.getTickets(this.securityService.user.cle);
    } else {
      this.adminService.getOneEntreprise(localStorage.getItem("currentEse")).then((entreprise: any) => {
        this.supportService.lists(entreprise.licenseCle).subscribe((res: any) => {
          this.tickets = res?.reverse();
        })
      });
    }
  }

  getTickets(licenseCle: string) {
    this.supportService.lists(licenseCle).subscribe((res: any) => {
      this.tickets = res?.reverse();
    })
  }

  filterDatatable(value: string) {
    console.log(value);
  }

  getTicketStatus(ticket: any) {
    return this.supportService.getTicketStatus(ticket);
  }
}
