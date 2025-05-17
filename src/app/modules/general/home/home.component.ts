import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from '../../../../environments/environment';
import { SeoService } from '../../../core/services/seo/seo.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PdfService } from './services/pdf.service';

export enum StatutDemande {
  PREPARE = 'En préparation',
  RDV = 'Rendez-vous pris',
  ENCOURS = 'En cours de saisie',
  VALIDE = 'Entretien validé',
}

export enum ColorDemande {
  PREPARE = '#ffd966',
  RDV = '#e69138',
  ENCOURS = '#6aa84f',
  VALIDE = '#3d85c6',
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  currentYear = new Date().getFullYear();

  currentEntretien = 1;

  statutDemande = StatutDemande;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor(private seoService: SeoService, private pdfService: PdfService) {
    const content =
      'This application was developed with ' +
      this.angular +
      ' and ' +
      this.bootstrap +
      ' It applies Routing, Lazy loading and Progressive Web App (PWA)';

    const title = 'Entretiens annuels';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
  }

  getColorStatut(item: StatutDemande): ColorDemande {
    const colorMap: Record<StatutDemande, ColorDemande> = {
      [StatutDemande.PREPARE]: ColorDemande.PREPARE,
      [StatutDemande.RDV]: ColorDemande.RDV,
      [StatutDemande.ENCOURS]: ColorDemande.ENCOURS,
      [StatutDemande.VALIDE]: ColorDemande.VALIDE,
    };

    return colorMap[item] || ColorDemande.PREPARE;
  }

  getPDF() {
    this.pdfService.downloadPdf(this.currentEntretien).subscribe({
      next: (data: Blob) => {
        console.log(data);
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(data);
        a.href = objectUrl;
        a.download = 'file.pdf';
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: (e) => console.error('downloadPdf error: ', e),
      complete: () => console.info('complete'),
    });
  }
}
