import { Component, OnInit } from '@angular/core';
import { InventaireService } from 'src/app/inventaire/service/inventaire.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-list-supports',
  templateUrl: './list-supports.component.html',
  styleUrls: ['./list-supports.component.sass']
})
export class ListSupportsComponent implements OnInit {

  tickets: any[];
  displayedColumns: string[] = ['numero','type', 'objet', 'entreprise', 'auteur', 'assigne', 'status'];
  
  inventaires = [];
  idUser: string;

  constructor(
    private supportService: SupportService
  ) { }

  ngOnInit(): void {
    this.tickets = [];
    this.idUser = localStorage.getItem("idUser");
    this.supportService.lists().subscribe((res: any) => {
      console.log(res);
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
