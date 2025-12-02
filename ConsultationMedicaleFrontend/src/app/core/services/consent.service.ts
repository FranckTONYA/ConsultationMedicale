import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consentement } from '../../models/consentement';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {

  private apiUrl = environment.apiUrl + '/consentement';

  constructor(private http: HttpClient) {}

  createConsent(patientId: number, medecinId: number): Observable<Consentement> {
    return this.http.post<Consentement>(`${this.apiUrl}/create`, {
      patientId,
      medecinId
    });
  }

  findByMedecin(medecinId: number): Observable<Consentement[]> {
    return this.http.get<Consentement[]>(`${this.apiUrl}/find-by-medecin/${medecinId}`);
  }

  findByPatient(patientId: number): Observable<Consentement[]> {
    return this.http.get<Consentement[]>(`${this.apiUrl}/find-by-patient/${patientId}`);
  }

  update(consent: Consentement): Observable<Consentement> {
    return this.http.put<Consentement>(`${this.apiUrl}/update`, consent);
  }

  updateStatus(id: number, statut: string): Observable<Consentement> {
    return this.http.put<Consentement>(`${this.apiUrl}/update-status/${id}`, { statut });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-by-id/${id}`);
  }
}
