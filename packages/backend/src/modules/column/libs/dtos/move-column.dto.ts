import { type TMoveColumn } from '@kanban-board/common';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import MoveParametersDto from '@/modules/shared/move/libs/dto/move-parameters.dto';

export default class MoveColumnDto extends MoveParametersDto implements TMoveColumn {
  @IsDefined({ message: 'Идентификатор доски обязателен для перемещения колонки' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Идентификатор доски должен быть числом' },
  )
  @IsInt({ message: 'Идентификатор доски должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор доски должен быть больше 0' })
  boardId: number;
}
