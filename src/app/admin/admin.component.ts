import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entretien } from '@shared/models/entretien.model';
import { environment } from '@environments/environment';
import { SeoService } from '@core/services/seo/seo.service';
import { Personne } from '@shared/models/personne.model';
import { Router, RouterModule } from '@angular/router';
import { Credentials, CredentialsService } from '@core/authentication/credentials.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

export class PersonneImpl {
  id!: string;
  personne!: Personne | null;
  entretienPro!: Entretien[] | null;
  entretienForm!: Entretien[] | null;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule, ProgressSpinnerModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;

  appInfo = environment.appInfo;
  applicationName = environment.application.name;

  private credentialsService = inject(CredentialsService);
  private _credentials!: Credentials | null;

  constructor(
    private seoService: SeoService,
    public router: Router,
  ) {
    this._credentials = this.credentialsService.credentials;
    const content =
      'This application was developed with ' +
      this.angular +
      ' and ' +
      this.bootstrap +
      ' It applies Routing, Lazy loading and Progressive Web App (PWA)';

    const title = 'Entretiens annuels : Admin';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
  }

  get isAdmin(): boolean {
    return this.credentialsService.isAdmin;
  }

  get isRH(): boolean {
    return this.credentialsService.isRH;
  }

  isActive(instruction: any, path: string): boolean {
    return this.router.url === path;
  }
}
