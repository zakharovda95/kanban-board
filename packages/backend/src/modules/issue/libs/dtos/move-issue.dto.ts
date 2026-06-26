import { TMoveIssue } from '@kanban-board/common';
import { IsInt, IsPositive } from 'class-validator';

import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';

export class MoveIssueDto extends MoveParametersDto implements TMoveIssue {
  @ValidateIfDefined()
  @IsInt()
  @IsPositive()
  toColumnId?: number;
}
