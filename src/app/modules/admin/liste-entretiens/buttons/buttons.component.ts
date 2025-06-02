import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entretien } from '@shared/models/entretien.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CommunicationPdfService } from '@shared/services/entretiens/communication-pdf.service';
import { TypeEntretien } from '@shared/enums/type-entretien.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-liste-entretiens-buttons',
  imports: [CommonModule, TableModule, ButtonModule, ButtonGroupModule],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css',
})
export class AdminListeEntretiensButtonsComponent {
  @Input()
  entretien!: Entretien;

  typeEntretienEnum = TypeEntretien;

  private router = inject(Router);

  private communicationService = inject(CommunicationPdfService);

  newEntretien() {
    if (this.entretien.type == this.typeEntretienEnum.ENTRETIEN_FORMATION) {
      this.router.navigate(['/forms/entretien-form/', this.entretien.id]);
    } else {
      this.router.navigate(['/forms/entretien-pro/', this.entretien.id]);
    }
  }

  getPDF() {
    if (!this.entretien) return;
    this.communicationService.envoyerGetPdf(this.entretien.id.toString());
  }

  viewPDF() {
    if (!this.entretien) return;
    this.communicationService.envoyerViewPdf(this.entretien.id.toString());
  }
}
