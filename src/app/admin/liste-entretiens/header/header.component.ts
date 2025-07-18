import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entretien } from '@shared/models/entretien.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { AdminListeEntretiensButtonsComponent } from '../buttons/buttons.component';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';

@Component({
  selector: 'app-admin-liste-entretiens-header',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    AdminListeEntretiensButtonsComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class AdminListeEntretiensHeaderComponent implements OnInit {
  @Input()
  entretien!: Entretien;

  @Input()
  displayDate: boolean = true;

  @Input()
  buttons: boolean = true;

  entretiens!: Entretien[];

  @Output() getPdf = new EventEmitter<number>();
  @Output() viewPdf = new EventEmitter<number>();

  ngOnInit(): void {}

  getStatutClasses() {
    const statut: StatutDemandeEnum = this.entretien!.statut;
    return {
      preparation: statut === StatutDemandeEnum.PREPARE,
      'rendez-vous': statut === StatutDemandeEnum.RDV,
      saisie: statut === StatutDemandeEnum.ENCOURS,
      'commentaires-personne': statut === StatutDemandeEnum.AGENTCOMMENTAIRE,
      'signe-personne': statut === StatutDemandeEnum.AGENTSIGN,
      'signe-chef': statut === StatutDemandeEnum.CHEFSIGN,
      valide: statut === StatutDemandeEnum.VALIDE,
    };
  }

  getAgentName(): string {
    if (!this.entretien) {
      return '';
    }

    return this.entretien.personne.prenom + ' ' + this.entretien.personne.nom;
  }

  getDateEntretien(): string {
    if (!this.entretien) {
      return '';
    }

    return this.entretien.dateEntretien || '';
  }

  getEntretienStatut(): string {
    if (!this.entretien) {
      return '';
    }
    return this.entretien.statut || '';
  }

  handleGetPdf(id: number) {
    if (!id) return;
    this.getPdf.emit(id);
  }

  handleViewPdf(id: number) {
    if (!id) return;
    this.viewPdf.emit(id);
  }
}
