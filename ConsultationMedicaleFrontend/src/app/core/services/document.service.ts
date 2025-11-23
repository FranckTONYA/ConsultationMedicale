import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl + '/document';

  constructor(private http: HttpClient) {}

  getByConsultation(id: number) {
    return this.http.get<any[]>(`${this.apiUrl}/find-by-consultation/${id}`);
  }

  deleteConsultationFile(id: number) {
    return this.http.delete(`${this.apiUrl}/delete-consultation-file/${id}`);
  }

  deleteOrdonnanceFile(id: number) {
    return this.http.delete(`${this.apiUrl}/delete-ordonnance-file/${id}`);
  }

  getConsultationFileBlob(fileName: string) {
    // Retourne le fichier en Blob pour affichage ou téléchargement
    return this.http.get(`${this.apiUrl}/get-consultation-file/${fileName}`, { responseType: 'blob' });
  }

  async getConsultationFileUrl(fileName: string): Promise<string> {
    const blob = await this.getConsultationFileBlob(fileName).toPromise();
    return URL.createObjectURL(blob!);
  }

  getOrdonnanceFileBlob(fileName: string) {
    // Retourne le fichier en Blob pour affichage ou téléchargement
    return this.http.get(`${this.apiUrl}/get-ordonnance-file/${fileName}`, { responseType: 'blob' });
  }

  async getOrdonnanceFileUrl(fileName: string): Promise<string> {
    const blob = await this.getOrdonnanceFileBlob(fileName).toPromise();
    return URL.createObjectURL(blob!);
  }

  getMessageFileBlob(fileName: string) {
    // Retourne le fichier en Blob pour affichage ou téléchargement
    return this.http.get(`${this.apiUrl}/get-message-file/${fileName}`, { responseType: 'blob' });
  }

  async getMessageFileUrl(fileName: string): Promise<string> {
    const blob = await this.getMessageFileBlob(fileName).toPromise();
    return URL.createObjectURL(blob!);
  }

}
