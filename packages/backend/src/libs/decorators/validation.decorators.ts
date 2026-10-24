import { ValidateIf } from 'class-validator';

export function ValidateIfDefinedAndNotNull() {
  return ValidateIf((_, value) => value != null);
}
