import { type TMoveColumn } from '@kanban-board/common';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';

export class MoveColumnDto extends MoveParametersDto implements TMoveColumn {
  @IsDefined({ message: VALIDATION_MESSAGES.idMustBeDefined })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeNumber },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  boardId: number;
}
