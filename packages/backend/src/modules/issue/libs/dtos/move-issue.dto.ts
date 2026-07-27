import { TMoveIssue } from '@kanban-board/common';
import { IsUUID } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';

export class MoveIssueDto extends MoveParametersDto implements TMoveIssue {
  @ValidateIfDefined()
  @IsUUID('4', { message: VALIDATION_MESSAGES.idMustBeAGuid })
  toColumnId?: string;
}
