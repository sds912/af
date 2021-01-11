import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiSupportUrl}/api/supports`;
  }

  create(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  get(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  lists(licence: string) {
    return this.http.get(`${this.apiUrl}?licence=${licence}`);
  }

  getTicketStatus(ticket: any) {
    if (ticket.closed === true) {
      return `<span class="badge badge-success">Clôturé</span>`;
    }
    let ticketStatus = '';
    switch (ticket.status) {
      case 1:
        ticketStatus = '<span class="badge badge-secondary">Pris en charge</span>';
        break;

      case 2:
        ticketStatus = '<span class="badge badge-info">En traitement</span>';
        break;

      case 3:
        ticketStatus = '<span class="badge badge-success">Traité</span>';
        break;

      default:
        ticketStatus = '<span class="badge badge-warning">Ouvert</span>';
        break;
    }
    return ticketStatus;
  }
}
