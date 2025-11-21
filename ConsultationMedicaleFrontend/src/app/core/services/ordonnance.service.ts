import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Ordonnance } from '../../models/ordonnance';

@Injectable({
  providedIn: 'root'
})
export class OrdonnanceService {
  private apiUrl = environment.apiUrl + '/ordonnance';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Ordonnance[]>(`${this.apiUrl}/getAll`);
  }

  getById(id: number) {
    return this.http.get<Ordonnance>(`${this.apiUrl}/${id}`);
  }

  getByPatient(idPatient: number) {
    return this.http.get<Ordonnance[]>(`${this.apiUrl}/find-by-patient/${idPatient}`);
  }

  getByMedecin(idMedecin: number) {
    return this.http.get<Ordonnance[]>(`${this.apiUrl}/find-by-medecin/${idMedecin}`);
  }

  createWithFile(ordonnance: Ordonnance, files: File[]) {
    const formData = new FormData();
    formData.append("ordonnance", new Blob([JSON.stringify(ordonnance)], { type: "application/json" }));
    if(files) files.forEach(f => formData.append("files", f));
    return this.http.post(`${this.apiUrl}/create-with-files`, formData);
  }

  updateWithFiles(id: number, ordonnance: Ordonnance, files: File[]) {
    const formData = new FormData();
    formData.append("ordonnance", new Blob([JSON.stringify(ordonnance)], { type: "application/json" }));
    if(files) files.forEach(f => formData.append("files", f));
    return this.http.put(`${this.apiUrl}/update-with-files/${id}`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/delete-by-id/${id}`);
  }
}
