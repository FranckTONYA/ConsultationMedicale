import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  menuOpen = false;
  isLoggedIn = false;
  username = 'Patient';
  user: { username: string; email: string } | null = null;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService) {
    // Vérifie que le code s’exécute bien dans un navigateur
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('token');
      console.log(localStorage.getItem('username'));
      this.username = localStorage.getItem('username') || 'Patient';
    }
  }

   ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.authService.userInfo$.subscribe(info => {
      this.user = info;
      console.log(this.user);
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
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
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.isLoggedIn = false;
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
