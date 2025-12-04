import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DossierMedical } from '../../models/dossier-medical';

@Injectable({
  providedIn: 'root'
})
export class DossierMedicalService {

private apiUrl = environment.apiUrl + '/dossier';

  constructor(private http: HttpClient) {}

  getById(id: number) {
    return this.http.get<DossierMedical>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<DossierMedical[]>(`${this.apiUrl}/getAll`);
  }

  getByPatient(idPatient: number) {
    return this.http.get<DossierMedical>(`${this.apiUrl}/find-by-patient/${idPatient}`);
  }
  
  getByMedecin(idMedecin: number) {
    return this.http.get<DossierMedical[]>(`${this.apiUrl}/find-by-medecin/${idMedecin}`);
  }

  updateWithFiles(id: number, dossierMedical: DossierMedical, files: File[]) {
    const formData = new FormData();
    formData.append("dossierMedical", new Blob([JSON.stringify(dossierMedical)], { type: "application/json" }));
    if(files) files.forEach(f => formData.append("files", f));
    return this.http.put(`${this.apiUrl}/update-with-files/${id}`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/delete-by-id/${id}`);
  }
}
