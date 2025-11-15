import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Consultation } from '../../models/consultation';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private apiUrl = environment.apiUrl + '/consultation';

  constructor(private http: HttpClient) {}

  add(data: Consultation) {
    return this.http.post(`${this.apiUrl}`, data);
  }


  getById(id: number) {
    return this.http.get<Consultation>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Consultation[]>(`${this.apiUrl}/getAll`);
  }

  update(id: number, data: any) {
    return this.http.put<Consultation>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getByPatient(idPatient: number) {
    return this.http.get<Consultation[]>(`${this.apiUrl}/find-by-patient/${idPatient}`);
  }

  getByMedecin(idMedecin: number) {
    return this.http.get<Consultation[]>(`${this.apiUrl}/find-by-medecin/${idMedecin}`);
  }
}
