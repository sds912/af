import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiSupportUrl}/api/clients`;
  }

  valideLicense(license: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.get(`${this.apiUrl}/validation?license=${license}`).subscribe((success: any) => {
        resolve(success);
      }, (error: any) => {
        reject(error);
      });
    });
  }
}
