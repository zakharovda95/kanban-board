import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import type { TCreateBoard } from '@/modules/board/libs/types/board.types';
import { ValidateIfDefinedAndNotNull } from '@/modules/libs/decorators/validation.decorators';

export class CreateBoardDto implements TCreateBoard {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  @MaxLength(128)
  description?: string | null;
}
