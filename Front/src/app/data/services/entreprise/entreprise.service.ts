import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Entreprise } from 'src/app/data/schema/entreprise';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}/api/entreprises`;
  }

  all() {
		return this.http.get(`${this.apiUrl}`); 
  }

  get(id: string) {
		return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(entreprise: Entreprise) {
    return this.http.post(`${this.apiUrl}`, entreprise);
  }

  update(id: number, entreprise: Entreprise) {
		return this.http.put(`${this.apiUrl}/${id}`, entreprise);
  }

  delete(id: number) {
		return this.http.delete(`${this.apiUrl}/${id}`);
  }

  importImmobilisations(formData: FormData) {
    return this.http.post(`${this.apiUrl}/import/immobilisations`, formData);
  }

  importCatalogues(formData: FormData) {
    return this.http.post(`${this.apiUrl}/import/catalogues`, formData);
  }

  importLocalites(formData: FormData) {
    return this.http.post(`${this.apiUrl}/import/localites`, formData);
  }

  importAgents(formData: FormData) {
    return this.http.post(`${this.apiUrl}/import/agents`, formData);
  }

  importProgession(entreprise: string, table: string) {
    return this.http.get(`${this.apiUrl}/import/progression?entreprise=${entreprise}&table=${table}`);
  }
}
