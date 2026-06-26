import type { TPatchIssue } from '@kanban-board/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import {
  ValidateIfDefined,
  ValidateIfDefinedAndNotNull,
} from '@/libs/decorators/validation.decorators';

export class PatchIssueDto implements TPatchIssue {
  @ValidateIfDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title?: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  description?: string | null;
}
