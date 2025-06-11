import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import SignaturePad, { Options } from 'signature_pad';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home-signature-pad',
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

  agent = '';

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

  openDialog(text: string) {
    this.agent = text;
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
      console.log(signatureData); // Vous pouvez utiliser cette URL pour sauvegarder l'image de la signature
      this.signaturePad.clear();
      this.display = false;
    }
  }
}
