import type { TUpdateColumn } from '@kanban-board/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import CreateColumnDto from '@/modules/column/libs/dtos/create-column.dto';

export default class UpdateColumnDto
  extends PartialType(OmitType(CreateColumnDto, ['boardId'] as const))
  implements TUpdateColumn
{
  @IsDefined({ message: 'Идентификатор колонки обязателен' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Идентификатор колонки должен быть числом' },
  )
  @IsInt({ message: 'Идентификатор колонки должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор колонки должен быть больше 0' })
  id: number;
}
