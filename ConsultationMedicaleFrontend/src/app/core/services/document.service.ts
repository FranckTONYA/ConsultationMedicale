import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl + '/document';

  constructor(private http: HttpClient) {}

  uploadFiles(consultationId: number, files: File[]) {
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));

    return this.http.post(`${this.apiUrl}/upload/${consultationId}`, formData);
  }

  getByConsultation(id: number) {
    return this.http.get<any[]>(`${this.apiUrl}/find-by-consultation/${id}`);
  }

  deleteDoc(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getFileBlob(fileName: string) {
    // Retourne le fichier en Blob pour affichage ou téléchargement
    return this.http.get(`${this.apiUrl}/file/${fileName}`, { responseType: 'blob' });
  }

  async getFileUrl(fileName: string): Promise<string> {
    const blob = await this.getFileBlob(fileName).toPromise();
    return URL.createObjectURL(blob!);
  }
}
