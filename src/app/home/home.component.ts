import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnneeScolaire } from '@shared/utils/annee-scolaire.util';
import { EntretienImpl, EntretienService } from '@shared/services/entretiens/entretien.service';
import { environment } from '@environments/environment';
import { SeoService } from '@core/services/seo/seo.service';
import { HomeItemComponent } from './item/item.component';
import { StatutDemandeEnum } from '@shared/enums/statut.deande.enum';

export enum ColorDemande {
  PREPARE = '#ffd966',
  RDV = '#e69138',
  ENCOURS = '#6aa84f',
  VALIDE = '#3d85c6',
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, HomeItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  currentYear = new Date();
  anneeScolaire = new AnneeScolaire(this.currentYear.getFullYear());

  currentEntretien = '1';
  currentUser = '1043637';

  statutDemande = StatutDemandeEnum;

  private entretienService = inject(EntretienService);
  // typeEntretienEnum = TypeEntretien;
  listeEntretien!: EntretienImpl;

  constructor(private seoService: SeoService) {
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

  ngOnInit(): void {
    this.entretienService.getEntretienByMatricule(this.currentUser).subscribe({
      next: (data: EntretienImpl) => {
        this.listeEntretien = data;
      },
      error: e => console.error('getEntretienByMatricule error: ', e),
    });
  }
}
