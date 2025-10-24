import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PatientService } from './patient.service';
import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  private userInfoSubject = new BehaviorSubject<any>(null);
  userInfo$ = this.userInfoSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private patientService: PatientService) {
    // Vérifie si on est dans le navigateur
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn.next(!!localStorage.getItem('jwtToken'));
    }
  }

  registerPatient(data: any) {
    return this.http.post(`${this.apiUrl}/register/patient`, data);
  }

  registerMedecin(data: any) {
    return this.http.post(`${this.apiUrl}/register/medecin`, data);
  }

  login(email: string, motDePasse: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, motDePasse })
    .pipe(
      tap(response => {
        localStorage.setItem('jwtToken', response.token);
      }),
      switchMap(() => this.patientService.getByEmail(email)),
      tap(user => {
        this.userInfoSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.loggedIn.next(true);
      })
    );
  }

  saveResponse(response: any) {
    if (isPlatformBrowser(this.platformId)) {

    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('jwtToken');
    }
    return null;
  }

  get currentUser():Utilisateur | null {
    if (this.userInfoSubject.value) {
    return this.userInfoSubject.value;
  }

  if (isPlatformBrowser(this.platformId)) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userInfoSubject.next(user);
      return user;
    }
  }

  return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwtToken');
      this.loggedIn.next(false);
    }
  }
}
