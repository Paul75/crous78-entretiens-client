import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ShibbolethService } from '@core/services/shibboleth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private shibbolethService: ShibbolethService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.shibbolethService.authState$.pipe(
      map((authState: any) => {
        if (authState.isAuthenticated) {
          return true;
        } else {
          return this.router.createUrlTree(['/login']);
        }
      }),
    );
  }
}
