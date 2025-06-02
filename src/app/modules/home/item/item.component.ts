import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { CommunicationPdfService } from '@shared/services/entretiens/communication-pdf.service';
import { TypeEntretien } from '@shared/enums/type-entretien.enum';
import { RouterLink } from '@angular/router';
import { Entretien } from '@shared/models/entretien.model';

@Component({
  selector: 'app-home-item',
  imports: [
    RouterLink,
    CommonModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export class HomeItemComponent implements OnInit {
  @Input()
  entretien!: Entretien | null;

  typeEntretienEnum = TypeEntretien;

  private communicationService = inject(CommunicationPdfService);

  ngOnInit(): void {}

  routeToForm() {
    if (!this.entretien) {
      return '';
    }
    if(this.entretien.type == this.typeEntretienEnum.ENTRETIEN_FORMATION) {
      return '/forms/entretien-form/' + this.entretien.id;
    }

    return '/forms/entretien-pro/' + this.entretien.id;
  }

  getAgentName(): string {
    if (!this.entretien) {
      return '';
    }
    
    return (
      this.entretien.agent.prenom +
      ' ' +
      this.entretien.agent.nom
    );
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

  getPDF(id: string) {
    // this.actionGetPdf.emit(id);
    this.communicationService.envoyerGetPdf(id);
  }

  viewPDF(id: string) {
    // this.actionViewPdf.emit(id);
    this.communicationService.envoyerViewPdf(id);
  }
}
