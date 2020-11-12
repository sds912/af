import { Component, OnInit } from '@angular/core';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-infos-support',
  templateUrl: './infos-support.component.html',
  styleUrls: ['./infos-support.component.sass']
})
export class InfosSupportComponent implements OnInit {

  constructor(private supportService: SupportService) { }

  ngOnInit(): void {
  }

  getTicketStatus(ticket: any) {
    return this.supportService.getTicketStatus(ticket);
  }
}
