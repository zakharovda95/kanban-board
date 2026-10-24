import type { TMoveParameters } from '@kanban-board/common';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export default class MoveParametersDto implements TMoveParameters {
  @ValidateIfDefinedAndNotNull()
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeInteger })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  previousId?: number;

  @IsDefined({ message: VALIDATION_MESSAGES.idRequired })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeInteger },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeInteger })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  targetId!: number;
}
