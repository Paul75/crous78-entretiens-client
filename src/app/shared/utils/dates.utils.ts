import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';

const datePipe = new DatePipe('fr-FR');

export function toDisplayDate(value: string | null | undefined): Date | null {
  return value ? new Date(value) : null;
}

export function toBddDate(value: Date | null | undefined): string | null {
  return value ? (datePipe.transform(value, 'yyyy-MM-dd') ?? null) : null;
}

export function transformDatesToDisplay(form: FormGroup): void {
  try {
    form.patchValue({
      dateEntretien: form.get('dateEntretien')?.value
        ? new Date(form.get('dateEntretien')?.value)
        : null,
      dateEntretienPrecedent: form.get('dateEntretienPrecedent')?.value
        ? new Date(form.get('dateEntretienPrecedent')?.value)
        : null,
      dateAffectation: form.get('dateAffectation')?.value
        ? new Date(form.get('dateAffectation')?.value)
        : null,
      personne: {
        dateNaissance: form.get('personne.dateNaissance')?.value
          ? new Date(form.get('personne.dateNaissance')?.value)
          : null,
        datePromotion: form.get('personne.datePromotion')?.value
          ? new Date(form.get('personne.datePromotion')?.value)
          : null,
      },
      superieur: {
        dateNaissance: form.get('superieur.dateNaissance')?.value
          ? new Date(form.get('superieur.dateNaissance')?.value)
          : null,
        datePromotion: form.get('superieur.datePromotion')?.value
          ? new Date(form.get('superieur.datePromotion')?.value)
          : null,
      },
    });
  } catch (_) {}
}
export function transformDatesToBdd(form: FormGroup): void {
  try {
    form.patchValue({
      dateEntretien: datePipe.transform(form.get('dateEntretien')?.value, 'yyyy-MM-dd'),
      dateEntretienPrecedent: datePipe.transform(
        form.get('dateEntretienPrecedent')?.value,
        'yyyy-MM-dd',
      ),
      dateAffectation: datePipe.transform(form.get('dateAffectation')?.value, 'yyyy-MM-dd'),
      personne: {
        dateNaissance: datePipe.transform(form.get('personne.dateNaissance')?.value, 'yyyy-MM-dd'),
        datePromotion: datePipe.transform(form.get('personne.datePromotion')?.value, 'yyyy-MM-dd'),
      },
      superieur: {
        dateNaissance: datePipe.transform(form.get('superieur.dateNaissance')?.value, 'yyyy-MM-dd'),
        datePromotion: datePipe.transform(form.get('superieur.datePromotion')?.value, 'yyyy-MM-dd'),
      },
    });
  } catch (_) {}
}
