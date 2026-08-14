import { TMoveIssue } from '@kanban-board/common';
import { IsInt } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';

export class MoveIssueDto extends MoveParametersDto implements TMoveIssue {
  @ValidateIfDefined()
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeDefined })
  toColumnId?: number;
}
