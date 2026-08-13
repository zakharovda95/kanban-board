import { type TUpdateIssue } from '@kanban-board/common';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import { CreateIssueDto } from '@/modules/issue/libs/dtos/create-issue.dto';

export class UpdateIssueDto
  extends PartialType(PickType(CreateIssueDto, ['description', 'title'] as const))
  implements TUpdateIssue
{
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeBigint },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  id: number;
}
