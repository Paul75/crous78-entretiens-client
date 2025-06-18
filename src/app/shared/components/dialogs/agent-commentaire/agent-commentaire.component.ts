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

  private entretienService = inject(EntretienService);
  private communicationCommentairesService = inject(CommunicationCommentairesService);

  entretienId!: number;
  agent = '';
  typeSignature: TypesSignatureEnum = TypesSignatureEnum.PERSONNE;

  isError = false;

  ngAfterViewInit(): void {}

  openDialog(entretienId: number, text: string, typesSignature: TypesSignatureEnum) {
    this.entretienId = entretienId;
    this.agent = text;
    this.typeSignature = typesSignature;
    this.display = true;
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
      next: _ => {},
      error: e => console.error('saveCommentaire error: ', e),
      complete: () => {
        this.display = false;

        // Envoi la validation de la signature au composant appelant
        this.communicationCommentairesService.saveCommentaires(this.entretienId);
      },
    });
  }
}
