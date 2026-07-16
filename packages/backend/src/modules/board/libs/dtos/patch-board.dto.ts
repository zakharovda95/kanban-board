import {
  BOARD_DESCRIPTION_MAXLENGTH,
  BOARD_TITLE_MAXLENGTH,
  type TPatchBoard,
} from '@kanban-board/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import {
  ValidateIfDefined,
  ValidateIfDefinedAndNotNull,
} from '@/libs/decorators/validation.decorators';

export class PatchBoardDto implements TPatchBoard {
  @ValidateIfDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(BOARD_TITLE_MAXLENGTH)
  title?: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  @MaxLength(BOARD_DESCRIPTION_MAXLENGTH)
  description?: string | null;
}
