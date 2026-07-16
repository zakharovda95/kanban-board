import {
  BOARD_DESCRIPTION_MAXLENGTH,
  BOARD_TITLE_MAXLENGTH,
  type TCreateBoard,
} from '@kanban-board/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export class CreateBoardDto implements TCreateBoard {
  @IsString()
  @IsNotEmpty()
  @MaxLength(BOARD_TITLE_MAXLENGTH)
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  @MaxLength(BOARD_DESCRIPTION_MAXLENGTH)
  description?: string | null;
}
