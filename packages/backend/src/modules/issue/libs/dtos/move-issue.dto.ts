import { TMoveIssue } from '@kanban-board/common';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';
import MoveParametersDto from '@/modules/shared/move/libs/dto/move-parameters.dto';

export default class MoveIssueDto extends MoveParametersDto implements TMoveIssue {
  @ValidateIfDefinedAndNotNull()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Идентификатор целевой колонки должен быть числом' },
  )
  @IsInt({ message: 'Идентификатор целевой колонки должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор целевой колонки должен быть больше 0' })
  toColumnId: number;

  @IsDefined({ message: 'Идентификатор доски обязателен для перемещения задачи' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Идентификатор доски должен быть числом' },
  )
  @IsInt({ message: 'Идентификатор доски должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор доски должен быть больше 0' })
  boardId: number;

  @IsDefined({ message: 'Идентификатор исходной колонки обязателен для перемещения задачи' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Идентификатор исходной колонки должен быть числом' },
  )
  @IsInt({ message: 'Идентификатор исходной колонки должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор исходной колонки должен быть больше 0' })
  fromColumnId: number;
}
