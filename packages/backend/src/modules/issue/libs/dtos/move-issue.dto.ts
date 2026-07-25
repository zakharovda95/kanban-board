import { TMoveIssue } from '@kanban-board/common';
import { IsUUID } from 'class-validator';

import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';

export class MoveIssueDto extends MoveParametersDto implements TMoveIssue {
  @ValidateIfDefined()
  @IsUUID()
  toColumnId?: string;
}
