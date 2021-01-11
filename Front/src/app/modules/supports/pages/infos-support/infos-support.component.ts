import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/shared/service/security.service';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-infos-support',
  templateUrl: './infos-support.component.html',
  styleUrls: ['./infos-support.component.sass']
})
export class InfosSupportComponent implements OnInit {
  @Input() ticket: any;
  loading: boolean = false;
  currentContainer = 1;
  niveauSatisfaction: number;
  niveauSatisfactions: number[] = [1, 2, 3, 4, 5];
  isSuperAdmin: boolean;
  isAuteur: boolean;
  wantClose: boolean = false;
  goToNextStep: boolean = false;

  constructor(private route: ActivatedRoute, private supportService: SupportService, private securityService: SecurityService) { }

  ngOnInit(): void {
    this.isSuperAdmin = this.securityService.SupAdmin;
    this.niveauSatisfaction = +this.ticket.satisfaction;
    this.isAuteur = this.ticket.auteur.username === localStorage.getItem("username");
    this.wantClose = false;
  }

  getTicketStatus(ticket: any) {
    return this.supportService.getTicketStatus(ticket);
  }

  closeTicket() {
    this.ticket.status = 3;
    this.ticket.closed = true;
    this.ticket.satisfaction = this.niveauSatisfaction;
    this.supportService.update(this.ticket.id, this.ticket).subscribe((res: any) => {
      this.ticket = res;
      this.wantClose = false;
    });
  }

  nextStep() {
    let status = +this.ticket.status;
    if (status < 3) {
      this.ticket.status = status + 1;
      console.log(status, this.ticket);
    }

    this.supportService.update(this.ticket.id, this.ticket).subscribe((res: any) => {
      console.log(res);
      this.ticket = res;
      this.goToNextStep = false;
    });
  }

  showImage(imageSrc: any) {
    document.getElementById('overlay-image').innerHTML = `<img class="" src="${imageSrc}" alt="">`
    document.getElementById('overlay').style.display = 'block';
  }

  hideImage() {
    document.getElementById("overlay").style.display = "none";
  }
}
