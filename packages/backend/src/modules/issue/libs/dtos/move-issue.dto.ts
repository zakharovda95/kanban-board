import { TMoveIssue } from '@kanban-board/common';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import MoveParametersDto from '@/modules/shared/move/libs/dto/move-parameters.dto';

export default class MoveIssueDto extends MoveParametersDto implements TMoveIssue {
  @ValidateIfDefined()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeNumber },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  toColumnId?: number;

  @IsDefined({ message: VALIDATION_MESSAGES.idMustBeDefined })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeNumber },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  boardId: number;

  @IsDefined({ message: VALIDATION_MESSAGES.idMustBeDefined })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeNumber },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  fromColumnId: number;
}
