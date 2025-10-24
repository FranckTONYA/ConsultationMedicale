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
    const user = this.authService.currentUser;

    if (!token || !user) {
      this.router.navigate(['/login']);
      return false;
    } 

  // Vérifie si la route a une restriction de rôle
  if (expectedRoles && expectedRoles.length > 0) {
    // Vérifie si le rôle utilisateur est inclus dans la liste autorisée
    const hasAccess = expectedRoles.includes(user.role);

    if (!hasAccess) {
      console.warn(`⛔ Accès refusé : ${user.role} n'est pas dans ${expectedRoles.join(', ')}`);
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
    return true;
  }
}
