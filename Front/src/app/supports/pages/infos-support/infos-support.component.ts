import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/shared/service/security.service';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-infos-support',
  templateUrl: './infos-support.component.html',
  styleUrls: ['./infos-support.component.sass']
})
export class InfosSupportComponent implements OnInit {
  ticket: any;
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private supportService: SupportService, private securityService: SecurityService) { }

  ngOnInit(): void {
    this.ticket = null;
    this.securityService.showLoadingIndicatior.next(true);
    this.supportService.get(this.route.snapshot.params.id).subscribe((res: any) => {
      if (res && res.id) {
        this.ticket = res;
      }
      this.securityService.showLoadingIndicatior.next(false);
      console.log(res);
    })
  }

  getTicketStatus(ticket: any) {
    return this.supportService.getTicketStatus(ticket);
  }
}
