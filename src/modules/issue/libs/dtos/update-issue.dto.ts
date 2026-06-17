import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import type { TUpdateIssue } from '@/modules/issue/libs/types/issue.types';
import { ValidateIfDefinedAndNotNull } from '@/modules/libs/decorators/validation.decorators';

export class UpdateIssueDto implements TUpdateIssue {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  description: string;
}
