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
  isSuperAdmin: boolean;

  constructor(
    private supportService: SupportService,
    private adminService: AdminService,
    private securityService: SecurityService
  ) { }

  ngOnInit(): void {
    this.tickets = [];
    this.isSuperAdmin = this.securityService.SupAdmin;
    if (this.isSuperAdmin) {
      this.displayedColumns.push('assigne');
    }
    this.idUser = localStorage.getItem("idUser");
    this.getTickets();
  }

  getTickets() {
    if (this.isSuperAdmin) {
      this.supportService.lists().subscribe((res: any) => {
        this.tickets = res?.reverse();
      });
      return;
    }
    this.adminService.getClients().then((clients: any) => {

      this.supportService.lists(clients[0].cle).subscribe((res: any) => {
        this.tickets = res?.reverse();
      })
    });
  }

  filterDatatable(value: string) {
    console.log(value);
  }

  getTicketStatus(ticket: any) {
    return this.supportService.getTicketStatus(ticket);
  }
}
