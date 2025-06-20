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
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';
import { EntretienService } from '@shared/services/entretiens/entretien.service';
import { SignatureComponent } from '@shared/components/dialogs/signature/signature.component';
import { TypesSignatureEnum } from '@shared/enums/types.signature.enum';
import { CommunicationSignatureService } from '@shared/services/signature/communication-signature.service';

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
    SignatureComponent,
  ],
  providers: [],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
})
export class AdminListeEntretiensButtonsComponent implements OnInit {
  @Input()
  entretien!: Entretien;

  minDate: Date = new Date();

  typeEntretienEnum = TypeEntretien;
  statutDemandeEnum = StatutDemandeEnum;
  dateValue = '';

  private router = inject(Router);

  private entretienService = inject(EntretienService);
  private communicationService = inject(CommunicationPdfService);
  private communicationSignatureService = inject(CommunicationSignatureService);

  private readonly displayBtnViewDownload = [
    this.statutDemandeEnum.ENCOURS,
    this.statutDemandeEnum.AGENTSIGN,
    this.statutDemandeEnum.CHEFSIGN,
    this.statutDemandeEnum.VALIDE,
  ];

  private readonly displayBtnRdv = [this.statutDemandeEnum.PREPARE];

  private readonly displayBtnSign = [this.statutDemandeEnum.CHEFSIGN];

  private readonly displayBtnPlus = [this.statutDemandeEnum.RDV, this.statutDemandeEnum.ENCOURS];

  @ViewChild('op') op!: Popover;

  // Signature
  @ViewChild('signatureDialog') signatureDialog!: SignatureComponent;

  ngOnInit(): void {
    // this.entretien!.dateEntretien = '';
    this.dateValue = '';

    this.communicationSignatureService.actionSaveSign$.subscribe(action => {
      if (this.entretien.id === action) this.afterSign(action);
    });
  }

  afterSign(entretienId: number) {
    this.entretien.statut = StatutDemandeEnum.VALIDE;
  }

  onDateSelect(event: any) {
    // console.log(formatDate(this.entretien.dateEntretien, 'yyyy-MM-dd', 'fr-FR'));
    this.dateValue = formatDate(this.dateValue, 'yyyy-MM-dd', 'fr-FR');
    return this.entretienService.saveDateEntretien(this.dateValue, this.entretien.id).subscribe({
      next: _ => {
        // console.log('Date saved successfully!', response);

        this.entretien.dateEntretien = this.dateValue;
        this.entretien.statut = StatutDemandeEnum.RDV;

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

  newEntretien() {
    this.entretienService
      .changeStatut(this.statutDemandeEnum.ENCOURS, this.entretien.id)
      .subscribe({
        next: _ => {
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
    this.communicationService.envoyerGetPdf(this.entretien.id);
  }

  viewPDF() {
    if (!this.entretien) return;
    this.communicationService.envoyerViewPdf(this.entretien.id);
  }

  goSignature() {
    if (!this.entretien) {
      return;
    }
    const sendName = this.entretien.superieur
      ? this.entretien.superieur?.prenom + ' ' + this.entretien.superieur?.nom
      : '';
    this.signatureDialog.openDialog(this.entretien.id, sendName, TypesSignatureEnum.SUPERIEUR);
  }

  // Gestion affichage des boutons

  get displayButtonsViewDownload(): boolean {
    return this.displayBtnViewDownload.includes(this.entretien.statut);
  }

  get displayButtonRdv(): boolean {
    return this.displayBtnRdv.includes(this.entretien.statut);
  }

  get displayButtonSign(): boolean {
    return this.displayBtnSign.includes(this.entretien.statut);
  }

  get displayButtonPlus(): boolean {
    return this.displayBtnPlus.includes(this.entretien.statut);
  }
}
