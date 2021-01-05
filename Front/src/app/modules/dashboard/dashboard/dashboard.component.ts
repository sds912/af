import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, useAnimation } from '@angular/animations';
import { SecurityService } from 'src/app/shared/service/security.service';
import { InventaireService } from 'src/app/data/services/inventaire/inventaire.service';
import { DashboardService } from '../services/dashboard.service';
import { timer, combineLatest } from 'rxjs';
import { PlaningService } from 'src/app/modules/planing/services/planing.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
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
  dataZones: any;
  dataInstructions: any;
  dataImmobilisations: any;
  dataInventairesCloses: number;
  timerSubscription: any;
  firstLoad: boolean;
  affectations: any[];
  localites: any[];
  

  constructor(
    private route: ActivatedRoute,
    private inventaireServ: InventaireService,
    public securityServ:SecurityService,
    private router: Router,
    private dashboardService: DashboardService,
    private planingService: PlaningService
  ) { }

  ngOnInit(): void {
    this.localites = [];
    this.dataZones = {pended: null, beginned: null, closed: null};
    this.dataInstructions = {prisConnaissance: null, pasPrisConnaissance: null};
    this.dataImmobilisations = {
      nonRetrouvees: {count: 0, bon: 0, mauvais: 0},
      scannees: {count: 0, bon: 0, mauvais: 0},
      nonScannees: {count: 0, bon: 0, mauvais: 0},
      nonReconciliees: {count: 0, bon: 0, mauvais: 0},
      reconciliees: {count: 0, bon: 0, mauvais: 0},
      rajoutees: {count: 0, bon: 0, mauvais: 0},
      codeBarreDefectueux: {count: 0, bon: 0, mauvais: 0}
    };
    this.dataInventairesCloses = 0;
    if(this.securityServ.admin){
      this.router.navigate(["/admin/entreprise"]);
      return;
    }
    this.affectations = [];
    this.idCurrentEse=localStorage.getItem("currentEse")
    this.getInventaireByEse()
    this.superviseur=this.securityServ.superviseur
    this.superviseurGene=this.securityServ.superviseurGene
    this.superviseurAdjoint=this.securityServ.superviseurAdjoint
    this.chefEquipe=this.securityServ.chefEquipe
    this.membreInv=this.securityServ.membreInv
    // this.dataEtat = {
    //   labels: ['(IS)', '(IR)', '(ICD)', '(ISNR)'],
    //   datasets: [
    //     {
    //       label: 'Bon état',
    //       backgroundColor: '#46b75c',
    //       borderColor: '#46b75c',
    //       data: [28, 48, 40, 19]
    //     },
    //     {
    //       label: 'Mauvais état',
    //       backgroundColor: '#ef474b',
    //       borderColor: '#ef474b',
    //       data: [65, 59, 80, 81]
    //     }
    //   ]
    // }

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

  public ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private subscribeToData(): void {
    this.timerSubscription = combineLatest(timer(5000)).subscribe(() => this.refreshData());
  }

  private refreshData(): void {
    if (this.idCurrentInv && this.idCurrentEse) {
      this.dashboardService.getData(this.idCurrentInv, this.idCurrentEse).then((data: any) => {
        console.log(data);
        this.dataZones = data.zones;
        this.dataInstructions = data.instructions;
        this.dataInventairesCloses = data.inventairesCloses;
        console.log(data.immobilisations);
        this.filterImmos(data.immobilisations);
      })
    }
    // this.subscribeToData();
  }

  getInventaireByEse() {
    // @TODO:Enveler l'api liste des localites et le mettre dans le back. Ensuite enlever l'api liste inventaire.
    this.securityServ.showLoadingIndicatior.next(true);
    this.idCurrentEse = localStorage.getItem("currentEse")
    this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(rep => {
      this.inventaires = rep?.reverse();
      this.idCurrentInv = this.inventaires[0]?.id;
      const inv = this.inventaires[0];
      if (!inv || (inv && inv.entreprise.id != this.idCurrentEse)) {
        this.securityServ.showLoadingIndicatior.next(false);
        return;
      }
      // this.localites = this.inventaires[0]?.localites;
      this.getPlanningByInv(this.idCurrentInv);
      this.refreshData();
      this.securityServ.showLoadingIndicatior.next(false);
    }, error => {
      this.securityServ.showLoadingIndicatior.next(false);
      console.log(error)
    })
  }

  filterImmos(immos: any) {
    this.dataImmobilisations = {
      nonRetrouvees: immos.nonRetrouvees,
      reconciliees: immos.reconciliees,
      nonReconciliees: immos.nonReconciliees,
      rajoutees: immos.rajoutees,
      codeBarreDefectueux: immos.codeBarreDefectueux,
      scannees: {
        count: immos.reconciliees.count + immos.nonReconciliees.count + immos.rajoutees.count + immos.codeBarreDefectueux.count,
        bon: immos.reconciliees.bon + immos.nonReconciliees.bon + immos.rajoutees.bon + immos.codeBarreDefectueux.bon,
        mauvais: immos.reconciliees.mauvais + immos.nonReconciliees.mauvais + immos.rajoutees.mauvais + immos.codeBarreDefectueux.mauvais,
      },
    };

    const dataBon = [
      this.dataImmobilisations.scannees.bon,
      this.dataImmobilisations.rajoutees.bon,
      this.dataImmobilisations.codeBarreDefectueux.bon,
      this.dataImmobilisations.nonRetrouvees.bon
    ];

    const dataMauvais = [
      this.dataImmobilisations.scannees.mauvais,
      this.dataImmobilisations.rajoutees.mauvais,
      this.dataImmobilisations.codeBarreDefectueux.mauvais,
      this.dataImmobilisations.nonRetrouvees.mauvais
    ];

    console.log(dataBon, dataMauvais);

    this.dataEtat = {
      labels: ['(IS)', '(IR)', '(ICD)', '(ISNR)'],
      datasets: [
        {
          label: 'Bon état',
          backgroundColor: '#46b75c',
          borderColor: '#46b75c',
          data: dataBon
        },
        {
          label: 'Mauvais état',
          backgroundColor: '#ef474b',
          borderColor: '#ef474b',
          data: dataMauvais
        }
      ]
    }
  }

  getPlanningByInv(id:number){
    if (!this.idCurrentEse) {
      return false;
    }
    this.planingService.getAffectations(`?inventaire.id=${id}`).then((rep: any) => {
        if (!rep || rep.length <= 0) {
          return;
        }
        rep.forEach((planning: any) => {
          if (this.canSeePlanning(planning)) {
            this.affectations.push(planning);
          }
          this.localites.push(planning.localite);
        });
      },
      error=>console.log(error)
    )
  }

  hasChild(idLoc: any) {
    const index = this.localites?.findIndex((loc: any) => loc.idParent == idLoc);
    if (index != -1) {
      return true;
    }
    return false;
  }

  canSeePlanning(affectation: any):boolean{
    
    const service=this.securityServ

    const cas1 = affectation?.user?.id == localStorage.getItem('idUser')

    const cas2 = service.superviseur||service.superviseurGene
    
    const cas3 = (service.superviseurAdjoint && (affectation?.user?.roles[0]=="ROLE_CE" || affectation?.user?.roles[0]=="ROLE_MI"))
      
    const cas4 = (service.chefEquipe && affectation?.user?.roles[0]=="ROLE_MI")
    
    if (cas1 || cas2 || cas3 || cas4) {
      return true
    }

    return false
  }

  locName(id){
    const localite=this.getOneById(id)
    let idParent=localite?.idParent
    let nom=" - "+localite?.nom
    if(idParent){
      this.localites.forEach(loc=>{
        if(idParent){
          let parent=this.getOneById(idParent)
          nom=" - "+parent?.nom+nom
          idParent=parent?.idParent
        }
      })
    }
    return nom.substr(3)
  }

  getOneById(id) {
    let l = this.localites?.find(loc => loc.id == id)
    return l ? l : null
  }

}
