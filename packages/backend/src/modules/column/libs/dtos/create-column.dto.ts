import {
  COLUMN_DESCRIPTION_MAXLENGTH,
  COLUMN_TITLE_MAXLENGTH,
  type TCreateColumn,
} from '@kanban-board/common';
import {
  IsDefined,
  IsHexColor,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export default class CreateColumnDto implements TCreateColumn {
  @IsDefined({ message: 'Идентификатор доски обязателен' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Идентификатор доски должен быть числом' },
  )
  @IsInt({ message: 'Идентификатор доски должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор доски должен быть больше 0' })
  boardId: number;

  @IsString({ message: 'Название колонки должно быть строкой' })
  @IsNotEmpty({ message: 'Название колонки обязательно для заполнения' })
  @MaxLength(COLUMN_TITLE_MAXLENGTH, {
    message: `Название колонки не должно превышать ${COLUMN_TITLE_MAXLENGTH} символов`,
  })
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString({ message: 'Описание колонки должно быть строкой' })
  @MaxLength(COLUMN_DESCRIPTION_MAXLENGTH, {
    message: `Описание колонки не должно превышать ${COLUMN_DESCRIPTION_MAXLENGTH} символов`,
  })
  description?: string | null;

  @IsHexColor({ message: 'Цвет колонки должен быть в формате HEX' })
  color: string;
}
