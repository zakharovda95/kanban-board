import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

import type { TCreateIssue } from '@/modules/issue/libs/types/issue.types';
import { ValidateIfDefinedAndNotNull } from '@/modules/libs/decorators/validation.decorators';

export class CreateIssueDto implements TCreateIssue {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  description: string | null;

  @IsInt()
  @IsPositive()
  columnId: number;
}
