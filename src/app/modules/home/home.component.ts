import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PdfService } from '@shared/services/pdf/pdf.service';
import { AnneeScolaire } from '@shared/utils/annee-scolaire.util';
import { EntretienService } from '@shared/services/entretiens/entretien.service';
import { environment } from '@environments/environment';
import { SeoService } from '../../core/services/seo/seo.service';

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

  currentYear = new Date();
  anneeScolaire = new AnneeScolaire(this.currentYear.getFullYear());

  currentEntretien = "1";

  statutDemande = StatutDemande;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private entretienService = inject(EntretienService);

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
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(data);
        a.href = objectUrl;
        a.download = 'entretien_pro.pdf';
        a.click();
        URL.revokeObjectURL(objectUrl);
        a.remove();
      },
      error: (e) => console.error('downloadPdf error: ', e)
    });
  }
}
