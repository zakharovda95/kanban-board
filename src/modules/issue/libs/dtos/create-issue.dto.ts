import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';
import type { TCreateIssue } from '@/modules/issue/libs/types/issue.types';

export class CreateIssueDto implements TCreateIssue {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  description: string | null;
}
