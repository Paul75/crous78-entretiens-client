import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entretien } from '@shared/models/entretien.model';
import { environment } from '@environments/environment';
import { SeoService } from '@core/services/seo/seo.service';
import { Personne } from '@shared/models/personne.model';
import { Router, RouterModule } from '@angular/router';

export class PersonneImpl {
  id!: string;
  personne!: Personne | null;
  entretienPro!: Entretien[] | null;
  entretienForm!: Entretien[] | null;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;

  appInfo = environment.appInfo;
  applicationName = environment.application.name;

  constructor(
    private seoService: SeoService,
    public router: Router,
  ) {
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

  isActive(instruction: any, path: string): boolean {
    return this.router.url === path;
  }
}
