import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, useAnimation } from '@angular/animations';
import { SecurityService } from 'src/app/shared/service/security.service';
import { InventaireService } from 'src/app/inventaire/service/inventaire.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dataEtat: any;
  dataEtatOptions: any;
  plannings: any[];
  superviseur:boolean
  superviseurGene:boolean
  superviseurAdjoint:boolean
  chefEquipe:boolean
  membreInv:boolean
  inventaires: any[]=[];
  idCurrentEse:string
  idCurrentInv:any
  constructor(private route: ActivatedRoute,private inventaireServ: InventaireService,public securityServ:SecurityService,private router: Router) { }

  ngOnInit(): void {
    if(this.securityServ.admin){
      this.router.navigate(["/admin/entreprise"])
    }
    this.idCurrentEse=localStorage.getItem("currentEse")
    this.getInventaireByEse()
    this.superviseur=this.securityServ.superviseur
    this.superviseurGene=this.securityServ.superviseurGene
    this.superviseurAdjoint=this.securityServ.superviseurAdjoint
    this.chefEquipe=this.securityServ.chefEquipe
    this.membreInv=this.securityServ.membreInv
    this.dataEtat = {
      labels: ['(IS)', '(IR)', '(ICD)', '(ISNR)'],
      datasets: [
        {
          label: 'Bon état',
          backgroundColor: '#46b75c',
          borderColor: '#46b75c',
          data: [28, 48, 40, 19]
        },
        {
          label: 'Mauvais état',
          backgroundColor: '#ef474b',
          borderColor: '#ef474b',
          data: [65, 59, 80, 81]
        }
      ]
    }

    this.dataEtatOptions = {
      legend: {
        display: false
      },
      scales:{
        xAxes: [{
          display: true,
          stacked: true,
          barPercentage: 0.8,
          gridLines: {
            display: false
          },
          ticks: {
            fontSize: 10
        }

        }],
        yAxes: [{
          display: false
        }]
      }
    }

    this.plannings = [
      {
        nom: 'Moustapha Diallo',
        date: '23/03/2019',
        lieu: 'Dakar'
      },
      {
        nom: 'Artur Ndiaye',
        date: '28/05/2019',
        lieu: 'Abidjan'
      },
      {
        nom: 'Abdoulaye Fall',
        date: '13/05/2019',
        lieu: 'Bamako'
      },
      {
        nom: 'Moustapha Diallo',
        date: '23/03/2019',
        lieu: 'Dakar'
      },
      {
        nom: 'Moustapha Diallo',
        date: '23/03/2019',
        lieu: 'Dakar'
      },
      {
        nom: 'Moustapha Diallo',
        date: '23/03/2019',
        lieu: 'Dakar'
      }
    ]

    for (let i = 0; i < 5; i++) {
      this.plannings.push({
        nom: 'Moustapha Diallo',
        date: '23/03/2019',
        lieu: 'Dakar'
      });
      
    }
  }
  inventaireChange(value:string):void{
    
  }
  getInventaireByEse() {
    this.securityServ.showLoadingIndicatior.next(true);
    this.idCurrentEse = localStorage.getItem("currentEse")
    this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(rep => {
      this.inventaires = rep?.reverse();
      this.idCurrentInv = this.inventaires[0]?.id;
      this.securityServ.showLoadingIndicatior.next(false);
    }, error => {
      this.securityServ.showLoadingIndicatior.next(false);
      console.log(error)
    })
  }

}
