import { IsInt, IsPositive } from 'class-validator';

import { TMoveIssue } from '@/modules/issue/libs/types/issue.types';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';

export class MoveIssueDto extends MoveParametersDto implements TMoveIssue {
  @IsInt()
  @IsPositive()
  columnId: number;
}
