import {
  COLUMN_DESCRIPTION_MAXLENGTH,
  COLUMN_TITLE_MAXLENGTH,
  type TPatchColumn,
} from '@kanban-board/common';
import { IsHexColor, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import {
  ValidateIfDefined,
  ValidateIfDefinedAndNotNull,
} from '@/libs/decorators/validation.decorators';

export class PatchColumnDto implements TPatchColumn {
  @ValidateIfDefined()
  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(COLUMN_TITLE_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${COLUMN_TITLE_MAXLENGTH}`,
  })
  title?: string;

  @ValidateIfDefinedAndNotNull()
  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(COLUMN_DESCRIPTION_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${COLUMN_DESCRIPTION_MAXLENGTH}`,
  })
  description?: string | null;

  @ValidateIfDefined()
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @IsHexColor({ message: VALIDATION_MESSAGES.isHex })
  color?: string;
}
