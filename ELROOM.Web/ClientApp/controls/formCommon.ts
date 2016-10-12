import * as React from 'react';
import { DictionaryType } from '../common';
import { Validator, ValidationResult } from './validators';
export * from '../common';

export interface FormApi {
  updateValueAndValidility(field: FormFieldApi);
  detachFromForm(field: FormFieldApi);
  attachToForm(field: FormFieldApi);
  validate(): DictionaryType<any>;
  getField(name: string): FormFieldApi;
  isDirty(): boolean;
  isValid(): boolean;
  isIgnoreSaveConfirm(): boolean;
  reset(): void;
  submit(): void;
}

export interface FormContext {
  ownerForm: FormApi;
}

export interface FormFieldApi {
  updateStatus(result: DictionaryType<ValidationResult>, onSubmit?: boolean, cb?: { (): void }): void;
  props: FormFieldProps;
  state: FormFieldState;
  getFieldValue(): any;
  resetState(): void;
  focus(): void;
}

export interface FormFieldProps {
  name?: string;
  validators?: Validator[];
  disabled?: boolean;
  errorText?: React.ReactNode;
  error?: string;
  autoFocus?: boolean;
}

export interface FormFieldState {
  errorText?: React.ReactNode;
  error?: string;
  value?: any;
  isValid?: boolean;
  isDirty?: boolean;
  isTouched?: boolean;
}