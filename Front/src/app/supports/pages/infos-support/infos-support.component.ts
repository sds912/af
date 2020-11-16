import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  currentContainer = 1;
  niveauSatisfaction: number;
  niveauSatisfactions: number[] = [1, 2, 3, 4, 5];
  isSuperAdmin: boolean;
  isAuteur: boolean;
  wantClose: boolean = false;
  goToNextStep: boolean = false;

  constructor(private route: ActivatedRoute, private supportService: SupportService, private securityService: SecurityService) { }

  ngOnInit(): void {
    this.ticket = null;
    this.securityService.showLoadingIndicatior.next(true);
    this.isSuperAdmin = this.securityService.SupAdmin;
    this.isAuteur = false;
    this.wantClose = false;
    this.supportService.get(this.route.snapshot.params.id).subscribe((res: any) => {
      if (res && res.id) {
        this.ticket = res;
        this.niveauSatisfaction = +this.ticket.satisfaction;
          this.isAuteur = this.ticket.auteur.username === localStorage.getItem("username");
      }
      this.securityService.showLoadingIndicatior.next(false);
      setTimeout(() => {
        this.createProgressBar();
      }, 1000);
      console.log(res);
    })
  }

  getTicketStatus(ticket: any) {
    return this.supportService.getTicketStatus(ticket);
  }

  closeTicket() {
    this.ticket.status = 3;
    this.ticket.closed = true;
    this.ticket.satisfaction = this.niveauSatisfaction;
    this.supportService.update(this.ticket.id, this.ticket).subscribe((res: any) => {
      console.log(res);
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

  createProgressBar() {
    let containerWidth = 0;

    const progressBar = document.querySelector('#container-progegress-bar') as HTMLElement; 

    if (!progressBar) {
      console.log('Progress bar could not be found');
      return;
    }

    console.log(progressBar);

    if(progressBar.clientHeight > progressBar.clientWidth){
      containerWidth = progressBar.clientWidth;
    } else {
      containerWidth = progressBar.clientHeight;
    }

    let circleWidth =  containerWidth - 10;
    let activeBorderWidth =  containerWidth;
    let padding = (progressBar.clientWidth - progressBar.clientHeight) / 2;

    document.getElementById('circle').style.width = circleWidth + 'px';
    document.getElementById('circle').style.height = circleWidth + 'px';
    progressBar.style.paddingLeft = padding + 'px';

    document.getElementById('border').style.width = activeBorderWidth + 'px';
    document.getElementById('border').style.height = activeBorderWidth + 'px';


    let degree = (180 * Number(2)) / (Number(5));

    document.getElementById('border').style.background = '-webkit-linear-gradient('+degree+'deg, #9a9a9a 50%, #00a651 50%)';

    var needleTransformDegree = 180 - degree;

    document.getElementById('needle').style.webkitTransform = 'rotate('+needleTransformDegree+'deg)';
                  
    progressBar.style.visibility = 'visible'
  }
}
