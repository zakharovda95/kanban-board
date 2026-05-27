import { applyDecorators } from '@nestjs/common';
import { IsDefined, ValidateIf } from 'class-validator';

export function ValidateIfDefined() {
  return ValidateIf((_, value) => value !== undefined);
}

export function ValidateIfDefinedAndNotNull() {
  return applyDecorators(
    IsDefined,
    ValidateIf((_, value) => value !== null),
  );
}
