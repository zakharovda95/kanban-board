import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

import {
  ValidateIfDefined,
  ValidateIfDefinedAndNotNull,
} from '@/libs/decorators/validation.decorators';
import type { TCreateIssue, TMoveIssue, TUpdateIssue } from '@/modules/issues/libs/issues.types';

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

export class UpdateIssueDto implements TUpdateIssue {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  description: string;
}

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
