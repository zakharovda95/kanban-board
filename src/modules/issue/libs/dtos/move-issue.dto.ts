import { IsInt, IsPositive } from 'class-validator';

import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import { TMoveIssue } from '@/modules/issue/libs/types/issue.types';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';

export class MoveIssueDto extends MoveParametersDto implements TMoveIssue {
  @ValidateIfDefined()
  @IsInt()
  @IsPositive()
  columnId?: number;
}
