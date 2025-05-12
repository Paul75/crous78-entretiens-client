import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private form!: FormGroup;

  getForm(): FormGroup {
    return this.form;
  }

  setForm(form: FormGroup): void {
    this.form = form;
  }
}