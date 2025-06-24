import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import SignaturePad, { Options } from 'signature_pad';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { TypesSignatureEnum } from '@shared/enums/types.signature.enum';
import { EntretienService } from '@shared/services/entretiens/entretien.service';
import { CommunicationSignatureService } from '@shared/services/communications/communication-signature.service';
import { CommunicationEmailsService } from '@shared/services/communications/communication-emails.service';

@Component({
  selector: 'app-signature-pad',
  imports: [CommonModule, DialogModule, ButtonModule, ButtonGroupModule, ToastModule],
  templateUrl: './signature.component.html',
  styleUrl: './signature.component.scss',
  providers: [MessageService],
})
export class SignatureComponent implements AfterViewInit {
  display = false;

  @ViewChild('signatureCanvas') signatureCanvasEl!: ElementRef;
  signaturePad!: SignaturePad;

  private messageService = inject(MessageService);
  private entretienService = inject(EntretienService);
  private communicationSignatureService = inject(CommunicationSignatureService);
  private communicationEmailsService = inject(CommunicationEmailsService);

  entretienId!: number;
  agent = '';
  typeSignature: TypesSignatureEnum = TypesSignatureEnum.PERSONNE;

  private configSignaturePad: Options = {
    minWidth: 2,
    maxWidth: 2,
    penColor: 'rgb(0, 0, 0)',
  };

  ngAfterViewInit(): void {
    this.signatureCanvasEl.nativeElement.width = 650;
    this.signatureCanvasEl.nativeElement.height = 300;
    this.signaturePad = new SignaturePad(
      this.signatureCanvasEl.nativeElement,
      this.configSignaturePad,
    );

    this.signaturePad.clear();
  }

  openDialog(entretienId: number, text: string, typesSignature: TypesSignatureEnum) {
    this.entretienId = entretienId;
    this.agent = text;
    this.typeSignature = typesSignature;
    this.display = true;
  }

  closeSignature() {
    this.agent = '';
    this.signaturePad.clear();
    this.display = false;
  }

  clearSignature() {
    if (this.signaturePad.isEmpty()) {
      this.messageService.add({
        severity: 'info',
        summary: 'Signature',
        detail: 'La signature est déjà vide. Merci de signer !',
      });
    }
    this.signaturePad.clear();
  }

  saveSignature() {
    if (this.signaturePad.isEmpty()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de signature',
        detail: 'La signature est vide. Merci de signer !',
      });
    } else {
      const signatureData = this.signaturePad.toDataURL();
      // enregistrement en BDD
      this.entretienService
        .saveSignature(this.entretienId, signatureData, this.typeSignature)
        .subscribe({
          next: _ => {
            // Envoi du Mail
            this.communicationEmailsService.envoyerMailSignature(this.entretienId).subscribe({
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
            this.signaturePad.clear();
          },
          error: e => console.error('getEntretienByMatricule error: ', e),
          complete: () => {
            this.display = false;

            // Envoi la validation de la signature au composant appelant
            this.communicationSignatureService.saveSignature(this.entretienId);
          },
        });
    }
  }
}
