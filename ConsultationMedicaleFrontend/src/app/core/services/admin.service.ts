import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Administrateur } from '../../models/administrateur';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl + '/administrateur';

  constructor(private http: HttpClient) {}

  getByEmail(email: string) {
    return this.http.get<Administrateur>(`${this.apiUrl}/find-by-email/${email}`);
  }

  getById(id: number) {
    return this.http.get<Administrateur>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Administrateur[]>(`${this.apiUrl}/getAll`);
  }

  update(id: number, data: any) {
    return this.http.put<Administrateur>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
