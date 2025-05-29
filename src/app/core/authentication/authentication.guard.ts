import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const page = next.data['page']; // Assurez-vous de définir 'page' dans vos données de route
    /*if (this.authenticationService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/unauthorized']); // Redirigez vers une page non autorisée
    return false;*/

    return this.authenticationService.checkAccess(page).pipe(
      map(hasAccess => {
        if (hasAccess) {
          return true;
        } else {
          this.router.navigate(['/unauthorized']); // Redirigez vers une page non autorisée
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/unauthorized']);
        return of(false);
      })
    );
  }
}
