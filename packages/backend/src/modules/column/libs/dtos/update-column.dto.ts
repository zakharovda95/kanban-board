import type { TUpdateColumn } from '@kanban-board/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import { CreateColumnDto } from '@/modules/column/libs/dtos/create-column.dto';

export class UpdateColumnDto
  extends PartialType(OmitType(CreateColumnDto, ['boardId'] as const))
  implements TUpdateColumn
{
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeBigint },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  id: number;
}
