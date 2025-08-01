import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';

import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-shared-editor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EditorModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true,
    },
  ],
})
export class EditorComponent implements ControlValueAccessor {
  @Input() formControlName?: string;
  @Input() formControl?: FormControl;
  @Input() formGroup!: FormGroup;
  @Input() style: any = {
    height: '320px',
    fontSize: '16px',
    fontFamily: 'Roboto, sans-serif',
  };

  control!: FormControl;

  value = '';
  onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit() {
    if (this.formControl) {
      this.control = this.formControl;
    } else if (this.formControlName && this.formGroup) {
      this.control = this.formGroup.get(this.formControlName) as FormControl;
    } else {
      throw new Error('Either formControl or formControlName + formGroup must be provided.');
    }
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optionnel
  }

  handleChange(event: any) {
    this.value = event.htmlValue;
    this.onChange(this.value);
  }
}
