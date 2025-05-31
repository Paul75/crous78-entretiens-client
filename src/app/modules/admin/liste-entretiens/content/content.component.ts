import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entretien } from '@shared/models/entretien.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { AdminListeEntretiensHeaderComponent } from '../header/header.component';
import { CommunicationPdfService } from '@shared/services/entretiens/communication-pdf.service';

@Component({
  selector: 'app-admin-liste-entretiens-content',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    AdminListeEntretiensHeaderComponent,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class AdminListeEntretiensContentComponent {
  @Input()
  entretiens!: Entretien[];

  private communicationService = inject(CommunicationPdfService);

  getPDF(id: string) {
    this.communicationService.envoyerGetPdf(id);
  }

  viewPDF(id: string) {
    this.communicationService.envoyerViewPdf(id);
  }
}
