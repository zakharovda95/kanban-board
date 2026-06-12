import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';
import type { TCreateBoard } from '@/modules/boards/libs/types/boards.types';

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
