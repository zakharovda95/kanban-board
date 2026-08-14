import type { TMoveParameters } from '@kanban-board/common';
import { IsInt, IsPositive } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export class MoveParametersDto implements TMoveParameters {
  @ValidateIfDefinedAndNotNull()
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  previousId?: number;

  @ValidateIfDefinedAndNotNull()
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeNumber })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  nextId?: number;
}
