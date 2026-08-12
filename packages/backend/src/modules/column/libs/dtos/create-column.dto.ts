import {
  COLUMN_DESCRIPTION_MAXLENGTH,
  COLUMN_TITLE_MAXLENGTH,
  type TCreateColumn,
} from '@kanban-board/common';
import {
  IsHexColor,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export class CreateColumnDto implements TCreateColumn {
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeBigint },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  boardId: number;

  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(COLUMN_TITLE_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${COLUMN_TITLE_MAXLENGTH}`,
  })
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString({ message: VALIDATION_MESSAGES.isString })
  @MaxLength(COLUMN_DESCRIPTION_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${COLUMN_DESCRIPTION_MAXLENGTH}`,
  })
  description?: string | null;

  @IsHexColor({ message: VALIDATION_MESSAGES.isHex })
  color: string;
}
