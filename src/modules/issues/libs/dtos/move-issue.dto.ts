import { IsInt, IsPositive } from 'class-validator';

import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import type { TMoveIssue } from '@/modules/issues/libs/types/issues.types';

export class MoveIssueDto implements TMoveIssue {
  @ValidateIfDefined()
  @IsInt()
  @IsPositive()
  columnId?: number;

  @ValidateIfDefined()
  @IsInt()
  @IsPositive()
  nextIssueId?: number;

  @ValidateIfDefined()
  @IsInt()
  @IsPositive()
  previousIssueId?: number;
}
