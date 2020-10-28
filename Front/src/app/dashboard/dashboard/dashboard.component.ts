import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, transition, useAnimation } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  role: string;
  dataEtat: any;
  dataEtatOptions: any;
  plannings: any[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((res: any) => {
      this.role = res.role;
    });

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

}
