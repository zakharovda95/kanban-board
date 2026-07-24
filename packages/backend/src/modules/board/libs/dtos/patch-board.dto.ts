import {
  BOARD_DESCRIPTION_MAXLENGTH,
  BOARD_TITLE_MAXLENGTH,
  type TPatchBoard,
} from '@kanban-board/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import {
  ValidateIfDefined,
  ValidateIfDefinedAndNotNull,
} from '@/libs/decorators/validation.decorators';

export class PatchBoardDto implements TPatchBoard {
  @ValidateIfDefined()
  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(BOARD_TITLE_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${BOARD_TITLE_MAXLENGTH}`,
  })
  title?: string;

  @ValidateIfDefinedAndNotNull()
  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(BOARD_DESCRIPTION_MAXLENGTH)
  description?: string | null;
}
