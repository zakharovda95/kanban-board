import { type TUpdateIssue } from '@kanban-board/common';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import CreateIssueDto from '@/modules/issue/libs/dtos/create-issue.dto';

export default class UpdateIssueDto
  extends PartialType(PickType(CreateIssueDto, ['description', 'title'] as const))
  implements TUpdateIssue
{
  @IsDefined({ message: 'Идентификатор задачи обязателен' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Идентификатор задачи должен быть числом' },
  )
  @IsInt({ message: 'Идентификатор задачи должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор задачи должен быть больше 0' })
  id: number;
}
