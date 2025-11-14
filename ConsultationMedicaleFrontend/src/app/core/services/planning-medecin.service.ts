import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PlanningMedecin } from '../../models/planning-medecin';

@Injectable({
  providedIn: 'root'
})
export class PlanningMedecinService {

  private apiUrl = environment.apiUrl + '/calendrier';

  constructor(private http: HttpClient) {}

  getByMedecin(id: number) {
    return this.http.get<PlanningMedecin[]>(`${this.apiUrl}/get-by-medecin/${id}`);
  }

  add(medecinId: number, data: PlanningMedecin) {
    return this.http.post(`${this.apiUrl}/add-planning/${medecinId}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/delete-by-id/${id}`);
  }
}
