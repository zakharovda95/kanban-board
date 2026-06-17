import { IsInt, Min } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';
import type { TMoveBoard } from '@/modules/board/libs/types/board.types';

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
