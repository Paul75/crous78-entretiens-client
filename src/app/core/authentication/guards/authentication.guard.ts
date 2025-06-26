import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';
import { CredentialsService } from '../credentials.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
  ) {}

  canActivate(): Observable<boolean> {
    console.log('Begin canActivate()');

    return this.authenticationService.setAuth().pipe(
      map(() => {
        if (this.credentialsService.isAuthenticated()) {
          console.log('connected');
          return true;
        }
        this.router.navigate(['/messages/401'], { replaceUrl: true });
        return false;
      }),
      catchError((err: any) => {
        console.debug('Not authenticated, redirecting...');
        this.router.navigate(['/messages/401'], { replaceUrl: true });
        return [false];
      }),
    );
  }
}
