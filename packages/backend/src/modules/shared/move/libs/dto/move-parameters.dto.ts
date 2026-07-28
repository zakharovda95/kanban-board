import type { TMoveParameters } from '@kanban-board/common';
import { IsInt, IsPositive } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export class MoveParametersDto implements TMoveParameters {
  @ValidateIfDefinedAndNotNull()
  @IsInt()
  @IsPositive()
  previousId?: number;

  @ValidateIfDefinedAndNotNull()
  @IsInt()
  @IsPositive()
  nextId?: number;
}
