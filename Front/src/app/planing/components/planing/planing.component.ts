import {
  Component, OnInit,ChangeDetectionStrategy,ViewChild,TemplateRef,} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import * as $ from "jquery";
import { InventaireService } from 'src/app/inventaire/service/inventaire.service';
import { PlaningService } from '../../services/planing.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { AdminService } from 'src/app/administration/service/admin.service';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-planing',
  templateUrl: './planing.component.html',
  styleUrls: ['./planing.component.sass']
})
export class PlaningComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
    localites: any
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: any[] = [];

  activeDayIsOpen: boolean = false;
  idCurrentInv=null
  inventaires=[]
  currentInv=null
  myId=''
  idCurrentEse=''
  localites=[]
  affectations=[]
  affectationsTampo=[]
  subdivisions = []
  imgLink=""
  roles = [
    {role:"ROLE_MI",level:1},
    {role:"ROLE_CE",level:2},
    {role:"ROLE_SuperViseurAdjoint",level:3},
    {role:"ROLE_SuperViseurGene",level:4},
    {role:"ROLE_Superviseur",level:5}
  ]
  tabOpen=[]
  idCurrentLocal=null
  firstSearchLoc=null
  searchValue=""
  constructor(private modal: NgbModal,
    private inventaireServ: InventaireService,
    private planingServ: PlaningService,
    private adminServ: AdminService,
    private sharedService: SharedService, 
    public securityServ: SecurityService,) {}

  ngOnInit(): void {
    this.imgLink = this.sharedService.baseUrl + "/images/"
    this.myId = localStorage.getItem('idUser')
    this.idCurrentEse=localStorage.getItem("currentEse")
    this.getInventaireByEse()
    this.traduireDay()
    this.traduireHeure()
    this.getOneEntreprise()
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
      console.log(date);
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: any): void {
    const localites=this.getTabLoc(event.idLoc)
    this.modalData = { event, action,localites };
    this.modal.open(this.modalContent, { size: 'md' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  traduireDay(){
    $(document).ready(function(){
      $('.cal-header').empty();
      $('.cal-header').append(
      '<div style="border: solid 0.2px #77777738 !important;" class="border-day cal-cell cal-past cal-weekend ng-star-inserted" role="columnheader" tabindex="0" ng-reflect-klass="cal-cell">Dimanche</div>'+
      '<div style="border: solid 0.2px #77777738 !important;" class="border-day cal-cell cal-past ng-star-inserted" role="columnheader" tabindex="0" ng-reflect-klass="cal-cell"> Lundi</div>'+
      '<div style="border: solid 0.2px #77777738 !important;" class="border-day cal-cell cal-past ng-star-inserted" role="columnheader" tabindex="0" ng-reflect-klass="cal-cell"> Mardi</div>'+
      '<div style="border: solid 0.2px #77777738 !important;" class="border-day cal-cell cal-today ng-star-inserted" role="columnheader" tabindex="0" ng-reflect-klass="cal-cell"> Mercredi</div>'+
      '<div style="border: solid 0.2px #77777738 !important;" class="border-day cal-cell cal-future ng-star-inserted" role="columnheader" tabindex="0" ng-reflect-klass="cal-cell"> Jeudi</div>'+
      '<div style="border: solid 0.2px #77777738 !important;" class="border-day cal-cell cal-future ng-star-inserted" role="columnheader" tabindex="0" ng-reflect-klass="cal-cell"> Vendredi</div>'+
      '<div style="border: solid 0.2px #77777738 !important;" class="border-day cal-cell cal-future cal-weekend ng-star-inserted" role="columnheader" tabindex="0" ng-reflect-klass="cal-cell"> Samedi</div>');
    })
  }

  traduireHeure(){
    this.hideHour()
    // $(document).ready(()=>{
    //   let a='';
    //   let j=0;
    //   for(let i=0;i<=24*2;i+=2){
    //     a=''+j;
    //     if(j<10) a='0'+j
    //     $('.cal-week-view .cal-time.ng-star-inserted').eq(i).empty().append(a+' H')
    //     j++
    //   }
    //   let div,val
    //   for(let i=0;i<7;i++){
    //     div=$('.cal-day-headers.ng-star-inserted div').eq(i)
    //     if(div.html()){
    //       val=this.traduireDate(div.html())
    //       div.empty().append(val)
    //     }
    //   }
    // })
    $('.flatpickr-calendar').empty();
  }

  traduireDate(value:string){
    if(value.search('January')>=0)
      value = value.replace('January','Janvier');
    else if(value.search('February')>=0)
      value = value.replace('February','Février');
    else if(value.search('March')>=0)
      value = value.replace('March','Mars');
    else if(value.search('April')>=0)
      value = value.replace('April','Avril');
    else if(value.search('June')>=0)
      value = value.replace('June','Juin');
    else if(value.search('July')>=0)
      value = value.replace('July','Juillet');
    else if(value.search('August')>=0)
      value = value.replace('August','Août');
    else if(value.search('September')>=0)
      value = value.replace('September','Septembre');
    else if(value.search('October')>=0)
      value = value.replace('October','Octobre');
    else if(value.search('November')>=0)
      value = value.replace('November','Novembre');
    else if(value.search('December')>=0)
      value = value.replace('December','Décembre');
    else if(value.search('Feb ')>=0){
      value = value.replace('Feb ','Fev ');
      value = value.replace('- Feb ','- Fev ');
      value = value.replace('- Mar ','- Mars ');//derniere semaine du mois
    }
    else if(value.search('Mar ')>=0){
      value = value.replace('Mar ','Mars ');
      value = value.replace('- Mar ','- Mars ');
      value = value.replace('- Apr ','- Avr ');
    }
    else if(value.search('Apr ')>=0){
      value = value.replace('Apr ','Avr ');
      value = value.replace('- Apr ','- Avr ');
      value = value.replace('- May ','- Mai ');
    }
    else if(value.search('May ')>=0){
      value = value.replace('May ','Mai ');
      value = value.replace('- May ','- Mai ');
      value = value.replace('- Jun ','- Juin ');
    }
    else if(value.search('Jun ')>=0){
      value = value.replace('Jun ','Juin ');
      value = value.replace('- Jun ','- Juin ');
      value = value.replace('- Jul ','- Juil ');
    }
    else if(value.search('Jul ')>=0){
      value = value.replace('Jul ','Juil ');
      value = value.replace('- Jul ','- Juil ');
      value = value.replace('- Aug ','- Août ');
    }
    else if(value.search('Aug ')>=0){
      value = value.replace('Aug ','Août ');
      value = value.replace('- Aug ','- Août ');
    }
    value=this.frenchDay(value)
    return value
  }

  frenchDay(value){
    if(value.search('Monday')>=0)
      value = value.replace('Monday','Lundi');
    else if(value.search('Tuesday')>=0)
      value = value.replace('Tuesday','Mardi');
    else if(value.search('Wednesday')>=0)
      value = value.replace('Wednesday','Mercredi');
    else if(value.search('Thursday')>=0)
      value = value.replace('Thursday','Jeudi');
    else if(value.search('Friday')>=0)
      value = value.replace('Friday','Vendredi');
    else if(value.search('Saturday')>=0)
      value = value.replace('Saturday','Samedi');
    else if(value.search('Sunday')>=0)
      value = value.replace('Sunday','Dimanche');
    return value;
  }

  hideHour(){
    $('.cal-time-events').hide();
    $('.cal-all-day-events').css("min-height", '80vh')
  }

  getInventaireByEse() {
    this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(
      rep => {
        this.inventaires = rep?.reverse()
        this.currentInv=rep?rep[0]:null
        this.idCurrentInv=this.currentInv?.id
        this.localites = this.currentInv?.localites
        if(this.idCurrentInv){
          this.getAffectationByInv(this.idCurrentInv)
        }
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }

  getAffectationByInv(id:number){
    this.planingServ.getAffectations("?inventaire.id="+id).then(
      rep=>{
        console.log(rep);
        this.affectations=this.lastAffectationLoc(rep)
        console.log(this.affectations);
        
        this.affectationsTampo=this.affectations
        this.mapToEvent(this.affectations);
      },
      error=>console.log(error)
    )
  }

  mapToEvent(affectations:any[]){
    this.events=affectations.map(affectation=>this.mapOneAffToEvent(affectation))
  }

  mapOneAffToEvent(affectation){
    const locId=affectation?.localite?.id
      const user=affectation?.user
    return {
      start: new Date(affectation?.debut),
      end: new Date(affectation?.fin),
      title: user?.nom+' ( '+this.getRole(user?.roles)+' ) '+this.locName(locId),
      color: colors.yellow,
      allDay: true,
      idLoc:locId,
      user:user
    }
  }

  showDetails(affectation){
    this.handleEvent('Clicked', this.mapOneAffToEvent(affectation) )
  }

  lastAffectationLoc(affectations){
    let lastSubdAffect=[]
    let already=[]
    this.trierAffectation(affectations,-1)
    affectations.forEach(affectation => {
      if(this.iCanSeeUser(affectation)){
        const idLoc=affectation.localite.id
        const sonHere=already.find(affect=>this.getOneById(affect.localite.id).idParent==idLoc && affect.user.id==affectation.user.id)!=null
        if(!sonHere){
          lastSubdAffect.push(affectation)
        }
        already.push(affectation)
      }
    });
    this.trierByRole(lastSubdAffect,-1)
    return lastSubdAffect
  }

  iCanSeeUser(affectation):boolean{
    
    const service=this.securityServ

    const cas1=affectation?.user?.id==this.myId

    const cas2=service.superviseur||service.superviseurGene
    
    const cas3=(service.superviseurAdjoint && (affectation?.user?.roles[0]=="ROLE_CE" || affectation?.user?.roles[0]=="ROLE_MI"))
      
    const cas4=(service.chefEquipe && affectation?.user?.roles[0]=="ROLE_MI")
    
    if(cas1||cas2||cas3||cas4){
      return true
    }

    return false
  }

  trierAffectation(tab,ordre=1){//trie objet, si decroissant ordre=-1 ex: this.trier(clients,'nombre',-1)
    return tab.sort((a,b)=>{
      if (parseInt(a.localite.id) > parseInt(b.localite.id)) return 1*ordre;
      else if (parseInt(b.localite.id) > parseInt(a.localite.id)) return -1*ordre;
      return 0;
    })
  }

  trierByRole(tab,ordre=1){//trie objet, si decroissant ordre=-1 ex: this.trier(clients,'nombre',-1)
    return tab.sort((a,b)=>{
      const arole=this.getRoleLevel(a.user?.roles)
      const brole=this.getRoleLevel(b.user?.roles)
      if (arole > brole) return 1*ordre;
      else if (brole > arole) return -1*ordre;
      return 0;
    })
  }

  getRoleLevel(roles):number{
    return this.roles?.find(r=>r.role==roles[0])?this.roles.find(r=>r.role==roles[0]).level:0
  }

  inventaireChange(id){
    this.currentInv=this.inventaires.find(inv=>inv.id==id)
    this.localites = this.currentInv?.localites
    this.getAffectationByInv(this.idCurrentInv)
  }

  getOneById(id) {
    let l = this.localites?.find(loc => loc.id == id)
    return l ? l : null
  }

  getRole(role, show = true):string {
    let r1 = '', r2 = ''
    if (role && (role == 'Superviseur' || role[0] == "ROLE_Superviseur")) {
      r1 = 'Superviseur'
      r2 = "ROLE_Superviseur"
    }
    else if (role && (role == 'Superviseur général' || role[0] == "ROLE_SuperViseurGene")) {
      r1 = 'Superviseur général'
      r2 = "ROLE_SuperViseurGene"
    }
    else if (role && (role == 'Superviseur adjoint' || role[0] == "ROLE_SuperViseurAdjoint")) {
      r1 = 'Superviseur adjoint'
      r2 = "ROLE_SuperViseurAdjoint"
    } else if (role && (role == 'Guest' || role[0] == "ROLE_Guest")) {
      r1 = 'Guest'
      r2 = "ROLE_Guest"
    } else if (role && (role == 'Président du comité' || role[0] == "ROLE_PC")) {
      r1 = 'Président du comité'
      r2 = "ROLE_PC"
    } else if (role && (role == 'Membre du comité' || role[0] == "ROLE_MC")) {
      r1 = 'Membre du comité'
      r2 = "ROLE_MC"
    } else if (role && (role == "Chef d'équipe" || role[0] == "ROLE_CE" || role == "Chef d'équipe de comptage")) {
      r1 = "Chef d'équipe de comptage"
      r2 = "ROLE_CE"
    } else if (role && (role == "Membre inventaire" || role[0] == "ROLE_MI" || role == "Membre d'équipe de comptage")) {
      r1 = "Membre d'équipe de comptage"
      r2 = "ROLE_MI"
    }
    if (show) return r1
    return r2
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

  getTabLoc(id){
    let tab=[]
    const localite=this.getOneById(id)
    let idParent=localite?.idParent
    let nom=localite?.nom
    tab.push({id:id,nom:nom})
    if(idParent){
      this.localites.forEach(loc=>{
        if(idParent){
          let parent=this.getOneById(idParent)
          nom=parent?.nom
          tab.push({id:parent?.id,nom:nom})
          idParent=parent?.idParent
        }
      })
    }
    return tab.reverse()
  }

  getOneEntreprise() {
    this.adminServ.getOneEntreprise(this.idCurrentEse).then(
      rep => {
        this.subdivisions=rep.subdivisions
      },
      error => {
        console.log(error)
      }
    )
  }

  longText(text, limit) {
    return this.sharedService.longText(text, limit)
  }

  search(value){
    this.intLocSearch()
    value=value?.toLowerCase()
    this.affectations=this.affectationsTampo.filter(
      affectation=>value=='' || 
      affectation?.user?.nom?.toLowerCase().search(value)>=0 || 
      this.getRole(affectation?.user?.roles)?.toLowerCase().search(value)>=0 ||
      this.getOneById(affectation?.localite?.id)?.nom?.toLowerCase().search(value)>=0
    )
    this.mapToEvent(this.affectations);
  }

  initsearch(){
    if(this.searchValue==''){
      this.affectations=this.affectationsTampo
      this.mapToEvent(this.affectations);
    }
  }

  intLocSearch(){
    this.tabOpen=[]
    this.firstSearchLoc=0
  }

  firstSub(localites){
    return localites?.filter(loc=>loc.position?.length>0)
  }

  getCurrentSubById(id){
    let l= this.getOneById(id)?.subdivisions
    return l?l:[]
  }

  openFirst(id){
    this.idCurrentLocal=id
    this.tabOpen[0]=id
    this.offUnderSub(1)//les surdivisions en dessous mettre entre les 2 et ne pas les regrouper
    this.searchLoc()
  }

  openOther(i,id){
    this.tabOpen[i]=id
    this.offUnderSub(i+1)//les surdivisions en dessous mettre entre les 2 et ne pas les regrouper
    this.searchLoc()
  }

  offUnderSub(j){
    for(let i=j;i<this.tabOpen.length;i++){
      if(this.tabOpen[i])this.tabOpen[i]=0
    }
  }

  searchLoc(){
    this.searchValue=''
    //ne pas recupperer directement l id en paramettre car le offUnderSub met les autres tabOpen à 0
    const tab=this.tabOpen.filter(idL=>idL!=0)
    const id=tab[tab.length-1]?tab[tab.length-1]:0
    this.affectations=this.affectationsTampo.filter(
      affectation=>{
        /** si la localité est un de ces parents de l element ou si c est l element lui mm */
        const localite=this.getOneById(affectation?.localite?.id)
        if(id==0 ||this.sameFamily(localite,id)||localite.id==id){
          return true
        }
      }
    )
    this.mapToEvent(this.affectations);
  }

  sameFamily(localite,idSearch):boolean{
    let bool=false
    let parent=this.getOneById(localite.idParent)
    while(parent && !bool){
      if(parent?.id==idSearch){
        bool=true
      }
      parent=this.getOneById(parent.idParent)
    }
    return bool
  }
}
