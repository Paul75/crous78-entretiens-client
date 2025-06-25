import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnneeScolaire } from '@shared/utils/annee-scolaire.util';
import { EntretienImpl, EntretienService } from '@shared/services/entretiens/entretien.service';
import { environment } from '@environments/environment';
import { SeoService } from '@core/services/seo/seo.service';
import { HomeItemComponent } from './item/item.component';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';
import { Credentials, CredentialsService } from '@core/authentication/credentials.service';

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

  private _credentials!: Credentials | null;

  currentYear = new Date();
  anneeScolaire = new AnneeScolaire(this.currentYear.getFullYear());

  private _currentUser!: number;

  statutDemande = StatutDemandeEnum;

  private entretienService = inject(EntretienService);
  listeEntretien!: EntretienImpl;

  constructor(
    private seoService: SeoService,
    private credentialsService: CredentialsService,
  ) {
    this._credentials = this.credentialsService.credentials;

    // console.log(this._credentials);
    this._currentUser = this._credentials?.personne.matricule ?? 0;

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
    this.entretienService.getEntretienByMatricule(this._currentUser.toString()).subscribe({
      next: (data: EntretienImpl) => {
        this.listeEntretien = data;
      },
      error: e => console.error('getEntretienByMatricule error: ', e),
    });
  }
}
