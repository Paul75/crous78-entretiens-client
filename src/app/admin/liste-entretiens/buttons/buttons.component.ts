import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Entretien } from '@shared/models/entretien.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CommunicationPdfService } from '@shared/services/entretiens/communication-pdf.service';
import { TypeEntretien } from '@shared/enums/type-entretien.enum';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Popover, PopoverModule } from 'primeng/popover';
import { DatePickerModule } from 'primeng/datepicker';
import { StatutDemandeEnum } from '@shared/enums/statut.deande.enum';
import { EntretienService } from '@shared/services/entretiens/entretien.service';
import { DateService } from '@shared/services/date.service';

@Component({
  selector: 'app-admin-liste-entretiens-buttons',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    DatePickerModule,
    PopoverModule,
    FormsModule,
  ],
  providers: [],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
})
export class AdminListeEntretiensButtonsComponent implements OnInit {
  @Input()
  entretien!: Entretien;

  typeEntretienEnum = TypeEntretien;
  statutDemandeEnum = StatutDemandeEnum;
  dateValue = '';

  private router = inject(Router);

  private entretienService = inject(EntretienService);
  private communicationService = inject(CommunicationPdfService);

  @ViewChild('op') op!: Popover;

  ngOnInit(): void {
    // this.entretien!.dateEntretien = '';
    this.dateValue = '';
  }

  onDateSelect(event: any) {
    // console.log(formatDate(this.entretien.dateEntretien, 'yyyy-MM-dd', 'fr-FR'));
    this.dateValue = formatDate(this.dateValue, 'yyyy-MM-dd', 'fr-FR');
    return this.entretienService.saveDateEntretien(this.dateValue, this.entretien.id).subscribe({
      next: response => {
        console.log('Date saved successfully!', response);

        this.op.hide();
      },
      error: err => {
        console.error('Error saving date:', err);
      },
      complete: () => {
        this.dateValue = '';
      },
    });
  }

  get displayButtonsViewDownload(): boolean {
    // Utilisation de l'opérateur 'includes' pour simplifier la vérification sur plusieurs statuts
    return [this.statutDemandeEnum.ENCOURS, this.statutDemandeEnum.VALIDE].includes(
      this.entretien.statut,
    );
  }

  get displayButtonPlus(): boolean {
    return this.entretien.statut != this.statutDemandeEnum.VALIDE;
  }

  newEntretien() {
    this.entretienService
      .changeStatut(this.statutDemandeEnum.ENCOURS, this.entretien.id)
      .subscribe({
        next: response => {
          if (this.entretien.type == this.typeEntretienEnum.ENTRETIEN_FORMATION) {
            this.router.navigate(['/forms/entretien/form/', this.entretien.id]);
          } else {
            this.router.navigate(['/forms/entretien/pro/', this.entretien.id]);
          }
        },
        error: err => {
          console.error('Error saving date:', err);
        },
      });
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
