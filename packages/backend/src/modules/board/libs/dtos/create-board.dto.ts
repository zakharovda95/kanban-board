import {
  BOARD_DESCRIPTION_MAXLENGTH,
  BOARD_TITLE_MAXLENGTH,
  type TCreateBoard,
} from '@kanban-board/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export default class CreateBoardDto implements TCreateBoard {
  @IsNotEmpty({ message: 'Название доски обязательно для заполнения' })
  @IsString({ message: 'Название доски должно быть строкой' })
  @MaxLength(BOARD_TITLE_MAXLENGTH, {
    message: `Название доски не должно превышать ${BOARD_TITLE_MAXLENGTH} символов`,
  })
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString({ message: 'Описание доски должно быть строкой' })
  @MaxLength(BOARD_DESCRIPTION_MAXLENGTH, {
    message: `Описание доски не должно превышать ${BOARD_DESCRIPTION_MAXLENGTH} символов`,
  })
  description?: string | null;
}
