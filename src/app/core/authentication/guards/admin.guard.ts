import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CredentialsService } from '../credentials.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private credentialsService: CredentialsService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.credentialsService.isAdmin) return true;
    this.router.navigate(['/home']);
    return false;
  }
}
