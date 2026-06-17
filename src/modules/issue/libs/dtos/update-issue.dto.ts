import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';
import type { TUpdateIssue } from '@/modules/issue/libs/types/issue.types';

export class UpdateIssueDto implements TUpdateIssue {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  description: string;
}
