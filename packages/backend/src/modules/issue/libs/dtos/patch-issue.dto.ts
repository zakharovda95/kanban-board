import { ISSUE_TITLE_MAXLENGTH, type TPatchIssue } from '@kanban-board/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import {
  ValidateIfDefined,
  ValidateIfDefinedAndNotNull,
} from '@/libs/decorators/validation.decorators';

export class PatchIssueDto implements TPatchIssue {
  @ValidateIfDefined()
  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(ISSUE_TITLE_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${ISSUE_TITLE_MAXLENGTH}`,
  })
  title?: string;

  @ValidateIfDefinedAndNotNull()
  @IsString({ message: VALIDATION_MESSAGES.isString })
  description?: string | null;
}
