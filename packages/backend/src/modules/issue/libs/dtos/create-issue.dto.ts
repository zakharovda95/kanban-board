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

export default class CreateIssueDto implements TCreateIssue {
  @IsDefined({ message: VALIDATION_MESSAGES.idRequired })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeInteger },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeInteger })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  boardId!: number;

  @IsDefined({ message: VALIDATION_MESSAGES.idRequired })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeInteger },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeInteger })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  columnId!: number;

  @IsString({ message: VALIDATION_MESSAGES.mustBeString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(ISSUE_TITLE_MAXLENGTH, {
    message: VALIDATION_MESSAGES.maxLength(ISSUE_TITLE_MAXLENGTH),
  })
  title!: string;

  @ValidateIfDefinedAndNotNull()
  @IsString({ message: VALIDATION_MESSAGES.mustBeString })
  description!: string | null;
}
