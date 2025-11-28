import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  menuOpen = false;
  isLoggedIn = false;
  username = "";
  role = "";
  user = new Utilisateur();

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService) {
    // Vérifie que le code s’exécute bien dans un navigateur
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!sessionStorage.getItem('jwtToken');
    }
  }

   ngOnInit(): void {
    // Réagit aux changements d’état de connexion
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    // Réagit aux changements d’infos utilisateur
    this.authService.userInfo$.subscribe(info => {
      if(info){
        this.user = info;
        this.username = this.user.prenom + " " + this.user.nom;
        this.role = (this.user && this.user.role) ? this.user.role : "" ;
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  openDashboard(){
    if(this.role === RoleUtilisateur.ADMINISTRATEUR)
      this.router.navigate(['/dashboard-admin']);
    if(this.role === RoleUtilisateur.MEDECIN)
      this.router.navigate(['/dashboard-medecin']);
    if(this.role === RoleUtilisateur.PATIENT)
      this.router.navigate(['/dashboard-patient']);
  }

  logout() {
    Swal.fire({
      icon: 'warning',
      title: 'Déconnexion',
      text: 'Voulez-vous vraiment vous déconnecter ?',
      showCancelButton: true,
      confirmButtonText: 'Oui, déconnecter',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.isLoggedIn = false;
        this.username = "";
        this.role = "";
        this.router.navigate(['/login']);
      }
    });
  }

  canViewByAdmin(): boolean {
    if (!this.isLoggedIn) return false;
    return this.role === RoleUtilisateur.ADMINISTRATEUR;
  }

  canViewByPatient(): boolean {
    if (!this.isLoggedIn) return false;
    return this.role === RoleUtilisateur.PATIENT;
  }

  canViewByMedecin(): boolean {
    if (!this.isLoggedIn) return false;
    return this.role === RoleUtilisateur.MEDECIN;
  }

  /**
   * Retourne true si l'utilisateur connecté peut voir la page
   * S'assure que isLoggedIn est vrai et que le rôle est ADMINISTRATEUR ou MEDECIN.
   */
  canViewByAdminAndMedecin(): boolean {
    if (!this.isLoggedIn) return false;
    return this.role === RoleUtilisateur.ADMINISTRATEUR || this.role === RoleUtilisateur.MEDECIN;

  }

  /**
   * Retourne true si l'utilisateur connecté peut voir la page
   * S'assure que isLoggedIn est vrai et que le rôle est ADMINISTRATEUR ou PATIENT.
   */
  canViewByAdminAndPatient(): boolean {
    if (!this.isLoggedIn) return false;
    return this.role === RoleUtilisateur.ADMINISTRATEUR || this.role === RoleUtilisateur.PATIENT;

  }

  /**
   * Retourne true si l'utilisateur connecté peut voir la page
   * S'assure que isLoggedIn est vrai et que le rôle est MEDECIN ou PATIENT.
   */
  canViewByMedecinAndPatient(): boolean {
    if (!this.isLoggedIn) return false;
    return this.role === RoleUtilisateur.MEDECIN || this.role === RoleUtilisateur.PATIENT;
  }
}
