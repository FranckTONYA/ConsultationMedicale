import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = environment.apiUrl + '/patient';

  constructor(private http: HttpClient) {}

  getByEmail(email: string) {
    return this.http.get(`${this.apiUrl}/find-by-email/${email}`);
  }


  getProfile(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateProfile(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getRendezVous(id: number) {
    return this.http.get(`${this.apiUrl}/${id}/rendezvous`);
  }
}
