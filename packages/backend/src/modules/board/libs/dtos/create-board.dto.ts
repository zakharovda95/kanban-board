import {
  BOARD_DESCRIPTION_MAXLENGTH,
  BOARD_TITLE_MAXLENGTH,
  type TCreateBoard,
} from '@kanban-board/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export class CreateBoardDto implements TCreateBoard {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @IsString({ message: VALIDATION_MESSAGES.isString })
  @MaxLength(BOARD_TITLE_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${BOARD_TITLE_MAXLENGTH}`,
  })
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString({ message: VALIDATION_MESSAGES.isString })
  @MaxLength(BOARD_DESCRIPTION_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${BOARD_DESCRIPTION_MAXLENGTH}`,
  })
  description?: string | null;
}
