import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Patient } from '../../models/patient';
import { Observable } from 'rxjs';
import { Medecin } from '../../models/medecin';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = environment.apiUrl + '/patient';

  constructor(private http: HttpClient) {}

  getByEmail(email: string) {
    return this.http.get<Patient>(`${this.apiUrl}/find-by-email/${email}`);
  }

  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Patient[]>(`${this.apiUrl}/getAll`);
  }

  update(id: number, data: any) {
    return this.http.put<Patient>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getMedecinsOfPatient(patientId: number) {
    return this.http.get<Medecin[]>(`${this.apiUrl}/get-medecins-of-patient/${patientId}`);
  }
}
