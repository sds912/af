import {
  Component, OnInit,ChangeDetectionStrategy,ViewChild,TemplateRef,} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import * as $ from "jquery";
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

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  activeDayIsOpen: boolean = false;

  constructor(private modal: NgbModal) {}

  ngOnInit(): void {
    this.traduireDay()
    this.traduireHeure()
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

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
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
    $(document).ready(()=>{
      let a='';
      let j=0;
      for(let i=0;i<=24*2;i+=2){
        a=''+j;
        if(j<10) a='0'+j
        $('.cal-week-view .cal-time.ng-star-inserted').eq(i).empty().append(a+' H')
        j++
      }
      let div,val
      for(let i=0;i<7;i++){
        div=$('.cal-day-headers.ng-star-inserted div').eq(i)
        if(div.html()){
          val=this.traduireDate(div.html())
          div.empty().append(val)
        }
      }
    })
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
}
