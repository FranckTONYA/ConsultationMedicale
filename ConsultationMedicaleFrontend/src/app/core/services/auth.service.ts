import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PatientService } from './patient.service';
import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';
import { UtilisateurService } from './utilisateur.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  private userInfoSubject = new BehaviorSubject<any>(null);
  userInfo$ = this.userInfoSubject.asObservable();

  private logoutTimer: any;

  private inactivityTimer: any;
  private inactivityLimit = 10 * 60 * 1000; // 10 minutes


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, 
  private utisateurService: UtilisateurService) {
    if (isPlatformBrowser(this.platformId)) {
      // Restaure la session si un token existe
      this.restoreSession();

      // Suivi de l’activité pour déconnexion automatique
      window.addEventListener('mousemove', () => this.resetInactivityTimer());
      window.addEventListener('keydown', () => this.resetInactivityTimer());
    }
  }

  login(email: string, motDePasse: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, motDePasse })
    .pipe(
      tap(response => {
        this.saveToken(response.token);
      }),
      switchMap(() => this.utisateurService.getByEmail(email)),
      tap(user => {
        this.userInfoSubject.next(user);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.loggedIn.next(true);
      })
    );
  }

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.logout();
      alert('Vous avez été déconnecté pour cause d’inactivité.');
    }, this.inactivityLimit);
  }

  private restoreSession() {
    const token = sessionStorage.getItem('jwtToken');
    const userData = sessionStorage.getItem('currentUser');

    if (token && userData) {
      const user = JSON.parse(userData);
      this.userInfoSubject.next(user);
      this.loggedIn.next(true);
    }
}

 saveToken(token: string, expiresInMinutes: number = 30) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('jwtToken', token);

      // Enregistrer la date d’expiration
      const expirationTime = new Date().getTime() + expiresInMinutes * 60 * 1000;
      sessionStorage.setItem('tokenExpiration', expirationTime.toString());

      this.loggedIn.next(true);
      this.startTokenTimer(expiresInMinutes);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem('jwtToken');
      const expiration = sessionStorage.getItem('tokenExpiration');

      if (!token || !expiration) return null;

      const now = new Date().getTime();
      if (now > +expiration) {
        this.logout();
        return null;
      }

      return token;
    }
    return null;
  }

  get currentUser():Utilisateur | null {
    if (this.userInfoSubject.value) {
      return this.userInfoSubject.value;
    }

    if (isPlatformBrowser(this.platformId)) {
      const storedUser = sessionStorage.getItem('currentUser');
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
      sessionStorage.removeItem('jwtToken');
      sessionStorage.removeItem('tokenExpiration');
      this.loggedIn.next(false);
      clearTimeout(this.logoutTimer);
    }
  }

  private startTokenTimer(expiresInMinutes: number) {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    this.logoutTimer = setTimeout(() => {
      this.logout();
      alert('Votre session a expiré. Veuillez vous reconnecter.');
    }, expiresInMinutes * 60 * 1000);
  }

  registerPatient(data: any) {
    return this.http.post(`${this.apiUrl}/register/patient`, data);
  }

  registerMedecin(data: any) {
    return this.http.post(`${this.apiUrl}/register/medecin`, data);
  }
}
