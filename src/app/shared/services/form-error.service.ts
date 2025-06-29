import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormErrorService {
  getErrorMessage(control: AbstractControl | null | undefined, fieldName: string): string | null {
    if (!control || !control.errors) return null;

    if (control.hasError('required')) {
      return `${fieldName} est obligatoire.`;
    }

    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `${fieldName} doit contenir au moins ${requiredLength} caractères.`;
    }

    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength').requiredLength;
      return `${fieldName} doit contenir au maximum ${requiredLength} caractères.`;
    }

    if (control.hasError('pattern')) {
      return `${fieldName} a un format invalide.`;
    }
    if (control.hasError('email')) {
      return `${fieldName} doit être une adresse email valide.`;
    }
    // Ajouter d’autres cas ici si besoin

    return null;
  }
}
