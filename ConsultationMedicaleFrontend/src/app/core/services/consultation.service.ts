import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Consultation } from '../../models/consultation';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private apiUrl = environment.apiUrl + '/consultation';

  constructor(private http: HttpClient) {}

  // Sauvegarder une consultation sans contrôle sur les plages horaire disponibles
  save(data: Consultation) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  // Créer une nouvelle consultation tout en effectuant certains contrôle nécessaire sur les plages horaire
  add(data: Consultation) {
    return this.http.post(`${this.apiUrl}/creer-consultation`, data);
  }

  getById(id: number) {
    return this.http.get<Consultation>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Consultation[]>(`${this.apiUrl}/getAll`);
  }

  update(id: number, data: any) {
    return this.http.put<Consultation>(`${this.apiUrl}/update/${id}`, data);
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

  /* Update + Upload fichiers */
  updateWithFiles(id: number, consultation: Consultation, files: File[]) {
    const formData = new FormData();

    formData.append(
      "consultation",
      new Blob([JSON.stringify(consultation)], { type: "application/json" })
    );

    if (files && files.length > 0) {
      files.forEach(f => formData.append("files", f));
    }

    return this.http.put(`${this.apiUrl}/update-with-files/${id}`, formData);
  }


  /* Upload standalone */
  uploadDocuments(id: number, files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    return this.http.post(`${this.apiUrl}/${id}/upload-documents`, formData);
  }

  /* Gestion documents */
  getDocumentsByConsultation(id: number) {
    return this.http.get<any[]>(environment.apiUrl + `/document/find-by-consultation/${id}`);
  }

  deleteDocument(id: number) {
    return this.http.delete(environment.apiUrl + `/document/delete-by-id/${id}`);
  }
}
