import { IsInt, IsPositive } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';
import type { TMoveParameters } from '@/modules/shared/move/libs/types/move.types';

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
