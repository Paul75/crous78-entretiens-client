import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { TypesSignatureEnum } from '@shared/enums/types.signature.enum';
import { EntretienService } from '@shared/services/entretiens/entretien.service';
import { FormsModule } from '@angular/forms';
import { Entretien } from '@shared/models/entretien.model';
import { StatutDemandeEnum } from '@shared/enums/statut.demande.enum';
import { CommunicationCommentairesService } from '@shared/services/communications/communication-commentaires.service';
import { MessageService } from 'primeng/api';
import { TypeEntretien } from '@shared/enums/type-entretien.enum';
import { CommunicationEmailsService } from '@shared/services/communications/communication-emails.service';

@Component({
  selector: 'app-agent-commentaire',
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    DialogModule,
    ButtonModule,
    ButtonGroupModule,
    ToastModule,
  ],
  templateUrl: './agent-commentaire.component.html',
  styleUrl: './agent-commentaire.component.scss',
  providers: [MessageService],
})
export class AgentCommentaireComponent implements AfterViewInit {
  display = false;

  commentairesEvaluation: string = '';
  commentairesEvaluationPerspectives: string = '';
  typeEntretien: TypeEntretien = TypeEntretien.ENTRETIEN_PRO;

  private messageService = inject(MessageService);
  private entretienService = inject(EntretienService);
  private communicationCommentairesService = inject(CommunicationCommentairesService);
  private communicationEmailsService = inject(CommunicationEmailsService);

  entretienId!: number;
  agent = '';
  typeSignature: TypesSignatureEnum = TypesSignatureEnum.PERSONNE;

  isError = false;

  ngAfterViewInit(): void {}

  get getEntretienPro() {
    return this.typeEntretien === TypeEntretien.ENTRETIEN_PRO;
  }

  openDialog(
    entretienId: number,
    text: string,
    typesSignature: TypesSignatureEnum,
    type: TypeEntretien,
  ) {
    this.entretienId = entretienId;
    this.agent = text;
    this.typeSignature = typesSignature;
    this.display = true;
    this.typeEntretien = type;
  }

  closeSignature() {
    this.agent = '';
    this.commentairesEvaluation = '';
    this.commentairesEvaluationPerspectives = '';
    this.display = false;
    this.isError = false;
  }

  saveCommentaire() {
    if (
      this.commentairesEvaluation.trim().length == 0 &&
      this.commentairesEvaluationPerspectives.trim().length == 0
    ) {
      this.isError = true;
      return;
    }
    this.isError = false;

    const datas: Partial<Entretien> = {
      commentairesEvaluation: this.commentairesEvaluation.trim(),
      commentairesEvaluationPerspectives: this.commentairesEvaluationPerspectives.trim(),
      statut: StatutDemandeEnum.AGENTCOMMENTAIRE,
    };

    this.entretienService.updateEntretien(this.entretienId, datas).subscribe({
      next: _ => {
        // Envoi du Mail
        this.communicationEmailsService.envoyerMailCommentaires(this.entretienId).subscribe({
          next: _ => {
            // console.log('Mail envoyé avec succès !');
          },
          error: err => {
            console.error("Erreur lors de l'envoi du mail :", err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: "Erreur lors de l'envoi du mail",
            });
          },
        });
      },
      error: e => console.error('saveCommentaire error: ', e),
      complete: () => {
        this.display = false;

        // Envoi la validation de la signature au composant appelant
        this.communicationCommentairesService.saveCommentaires(this.entretienId);
      },
    });
  }
}
