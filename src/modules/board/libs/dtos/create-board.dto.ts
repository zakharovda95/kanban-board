import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';
import type { TCreateBoard } from '@/modules/board/libs/types/board.types';

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
