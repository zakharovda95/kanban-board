import type { TUpdateColumn } from '@kanban-board/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import CreateColumnDto from '@/modules/column/libs/dtos/create-column.dto';

export default class UpdateColumnDto
  extends PartialType(OmitType(CreateColumnDto, ['boardId'] as const))
  implements TUpdateColumn
{
  @IsDefined({ message: VALIDATION_MESSAGES.idRequired })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeInteger },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeInteger })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  id!: number;
}
