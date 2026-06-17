import { ValidateIf } from 'class-validator';

export function ValidateIfDefined() {
  return ValidateIf((_, value) => value !== undefined);
}

export function ValidateIfDefinedAndNotNull() {
  return ValidateIf((_, value) => value != null);
}
