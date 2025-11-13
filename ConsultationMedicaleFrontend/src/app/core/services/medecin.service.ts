import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Medecin } from '../../models/medecin';

@Injectable({
  providedIn: 'root'
})
export class MedecinService {

  private apiUrl = environment.apiUrl + '/medecin';

  constructor(private http: HttpClient) {}

  getByEmail(email: string) {
    return this.http.get<Medecin>(`${this.apiUrl}/find-by-email/${email}`);
  }

  getById(id: number) {
    return this.http.get<Medecin>(`${this.apiUrl}/${id}`);
  }

  getByINAMI(inami: number) {
    return this.http.get<Medecin>(`${this.apiUrl}/find-by-inami/${inami}`);
  }

  getAll() {
    return this.http.get<Medecin[]>(`${this.apiUrl}/getAll`);
  }

  update(id: number, data: any) {
    return this.http.put<Medecin>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/delete-by-id/${id}`);
  }

  assignPatientToMedecin(medecinId: number, patientId: number) {
    return this.http.post(`${this.apiUrl}/assign-patient`,{medecinId, patientId});
  }
  
  removePatientFromMedecin(medecinId: number, patientId: number) {
    return this.http.delete(`${this.apiUrl}/remove-patient/${medecinId}${patientId}`);
  }
}
