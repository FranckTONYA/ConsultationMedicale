import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const token = this.authService.getToken();
    const expectedRoles = route.data['roles'];
    const expectedRole = route.data['role'];
    const user = this.authService.currentUser;
    
    if (!token || !user) {
      Swal.fire('Connexion réquise', 'Vous devez être connecté pour acceder à ce service.', 'error');
      this.router.navigate(['/login']);
      return false;
    } 

    // Vérifie si la route a une restriction de rôle
    if(expectedRole){ // Cas d'un seul rôle autorisé
      if (user.role !== expectedRole) {
        console.warn(`⛔ Accès refusé : ${user.role} ne correspond pas au rôle  ${expectedRole}`);
        this.router.navigate(['/login']);
        return false;
      }

    }else if(expectedRoles && expectedRoles.length > 0){ // Cas de plusieurs rôles autorisés
      // Vérifie si le rôle utilisateur est inclus dans la liste de rôles autorisés
      const hasAccess = expectedRoles.includes(user.role);

      if (!hasAccess) {
        console.warn(`⛔ Accès refusé : ${user.role} n'est pas dans ${expectedRoles.join(', ')}`);
        this.router.navigate(['/login']);
        return false;
      }
    }
  
    return true;
  }
}
