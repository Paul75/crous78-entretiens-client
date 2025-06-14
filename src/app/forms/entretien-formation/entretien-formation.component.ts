import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@environments/environment';
import { SeoService } from '@core/services/seo/seo.service';

@Component({
  selector: 'app-entretien-formation',
  imports: [CommonModule /*, RouterLink*/],
  templateUrl: './entretien-formation.component.html',
  styleUrl: './entretien-formation.component.scss',
})
export class EntretienFormationComponent {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  constructor(private seoService: SeoService) {
    const content =
      'This application was developed with ' +
      this.angular +
      ' and ' +
      this.bootstrap +
      ' It applies Routing, Lazy loading and Progressive Web App (PWA)';

    const title = 'Entretien professionnel Title : Home Page';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
  }
}
