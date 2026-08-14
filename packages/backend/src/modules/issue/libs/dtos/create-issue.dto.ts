import { ISSUE_TITLE_MAXLENGTH, type TCreateIssue } from '@kanban-board/common';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export class CreateIssueDto implements TCreateIssue {
  @IsDefined({ message: VALIDATION_MESSAGES.idMustBeDefined })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeNumber },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  boardId: number;

  @IsDefined({ message: VALIDATION_MESSAGES.idMustBeDefined })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeNumber },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  columnId: number;

  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(ISSUE_TITLE_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${ISSUE_TITLE_MAXLENGTH}`,
  })
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString({ message: VALIDATION_MESSAGES.isString })
  description: string | null;
}
