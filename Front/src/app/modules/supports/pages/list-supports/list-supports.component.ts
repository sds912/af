import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  ticket: any;
  
  displayedColumns: string[] = ['numero', 'startDate', 'type', 'objet', 'entreprise', 'auteur', 'status'];
  
  inventaires = [];
  idUser: string;

  constructor(
    private supportService: SupportService,
    private adminService: AdminService,
    private securityService: SecurityService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.tickets = [];
    this.ticket = null;
    this.idUser = localStorage.getItem("idUser");
    if (this.securityService.admin) {
      this.getTickets(this.securityService.user.cle);
    } else {
      this.adminService.getOneEntreprise(localStorage.getItem("currentEse")).then((entreprise: any) => {
        this.getTickets(entreprise?.license?.licenseCle);
      });
    }
  }

  getTickets(licenseCle: string) {
    this.supportService.lists(licenseCle).subscribe((res: any) => {
      if (res && res.length > 0) {
        let entrepriseTickets = res.filter((_ticket: any) => {return _ticket?.entreprise?.id == localStorage.getItem("currentEse")});
        this.tickets = entrepriseTickets?.reverse();
      }
    })
  }

  filterDatatable(value: string) {
    console.log(value);
  }

  getTicketStatus(_ticket: any) {
    return this.supportService.getTicketStatus(_ticket);
  }

  viewDetail(detailTicket: any, _ticket: any) {
    console.log(detailTicket, _ticket);
    this.ticket = _ticket;
    this.dialog.open(detailTicket);
  }
}
