import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['expectedRoles'];
    const currentRole = this.authService.getRole();

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRoles && currentRole && expectedRoles.includes(currentRole)) {
      return true;
    }

    // Si rôle non autorisé, on redirige vers l'overview par défaut du dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}
