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

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export default class CreateIssueDto implements TCreateIssue {
  @IsDefined({ message: 'Идентификатор доски обязателен' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Идентификатор доски должен быть числом' },
  )
  @IsInt({ message: 'Идентификатор доски должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор доски должен быть больше 0' })
  boardId: number;

  @IsDefined({ message: 'Идентификатор колонки обязателен' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Идентификатор колонки должен быть числом' },
  )
  @IsInt({ message: 'Идентификатор колонки должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор колонки должен быть больше 0' })
  columnId: number;

  @IsString({ message: 'Название задачи должно быть строкой' })
  @IsNotEmpty({ message: 'Название задачи обязательно для заполнения' })
  @MaxLength(ISSUE_TITLE_MAXLENGTH, {
    message: `Название задачи не должно превышать ${ISSUE_TITLE_MAXLENGTH} символов`,
  })
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString({ message: 'Описание задачи должно быть строкой' })
  description: string | null;
}
