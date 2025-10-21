import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  private userInfoSubject = new BehaviorSubject<{ username: string; email: string } | null>(null);
  userInfo$ = this.userInfoSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
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
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('jwtToken', response.token);
            // localStorage.setItem('username', response.username);
            // localStorage.setItem('email', response.email);
            // this.userInfoSubject.next({ username: response.username, email: response.email });
            this.userInfoSubject.next({ username: response.token, email: response.token });
            this.loggedIn.next(true);
          }
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

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwtToken');
      this.loggedIn.next(false);
    }
  }
}
