import { type TUpdateIssue } from '@kanban-board/common';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import CreateIssueDto from '@/modules/issue/libs/dtos/create-issue.dto';

export default class UpdateIssueDto
  extends PartialType(PickType(CreateIssueDto, ['description', 'title'] as const))
  implements TUpdateIssue
{
  @IsDefined({ message: VALIDATION_MESSAGES.idMustBeDefined })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeNumber },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  id: number;
}
