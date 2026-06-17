import { IsInt, IsPositive } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/modules/libs/decorators/validation.decorators';
import { TMoveParameters } from '@/modules/libs/types/move.types';

export class MoveDto implements TMoveParameters {
  @ValidateIfDefinedAndNotNull()
  @IsInt()
  @IsPositive()
  previousId?: number;

  @ValidateIfDefinedAndNotNull()
  @IsInt()
  @IsPositive()
  nextId?: number;
}
