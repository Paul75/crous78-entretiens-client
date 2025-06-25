import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { environment } from '@environments/environment';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CredentialsService, Personne } from '@core/authentication/credentials.service';
import { RedirectService } from '@shared/services/redirect.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  appInfo = environment.appInfo;
  applicationName = environment.application.name;

  @Output() logout = new EventEmitter<void>();

  collapsed = true;

  user!: Personne | null;

  private credentialsService = inject(CredentialsService);
  private redirectService = inject(RedirectService);
  private router: Router = inject(Router);

  get isConnected(): boolean {
    return this.credentialsService.isAuthenticated();
  }

  get isAdmin(): boolean {
    return this.credentialsService.isAdmin;
  }

  get email(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.personne.email : null;
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.personne.email : null;
  }

  getUser() {
    const credentials = this.credentialsService.credentials;
    this.user = credentials ? credentials.personne : null;
  }

  getRole(): string {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.personne.role.libelle : '';
  }

  onLogout(): void {
    this.credentialsService.logout();
    this.redirectService.redirectTo(environment.shibboleth.loginUrl);
    // this.logout.emit();
  }
}
