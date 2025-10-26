import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Utilisateur } from '../../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private apiUrl = environment.apiUrl + '/utilisateur';

  constructor(private http: HttpClient) {}

  getByEmail(email: string) {
    return this.http.get<Utilisateur>(`${this.apiUrl}/find-by-email/${email}`);
  }

  getById(id: number) {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/getAll`);
  }
}
