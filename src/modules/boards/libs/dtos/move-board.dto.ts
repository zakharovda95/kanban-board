import { IsInt, Min } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';
import type { TMoveBoard } from '@/modules/boards/libs/types/boards.types';

export class MoveBoardDto implements TMoveBoard {
  @ValidateIfDefinedAndNotNull()
  @IsInt()
  @Min(1)
  nextBoardId?: number | null;

  @ValidateIfDefinedAndNotNull()
  @IsInt()
  @Min(1)
  previousBoardId?: number | null;
}
