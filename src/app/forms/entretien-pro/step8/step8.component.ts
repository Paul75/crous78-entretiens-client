import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FormProvider } from '../../providers/form.provider';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entretien-pro-step8',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    TextareaModule,
  ],
  providers: [],
  templateUrl: './step8.component.html',
  styleUrl: './step8.component.scss',
})
export class EntretienProStep8Component implements OnInit {
  form: FormGroup;
  private router = inject(Router);

  constructor(private formProvider: FormProvider) {
    this.form = this.formProvider.getForm();
  }

  ngOnInit() {
    this.router.navigate(['/forms/entretien/confirmation', this.form.value.id], {
      replaceUrl: true,
    });
  }

  get registerFormControl() {
    return this.form.controls;
  }
}
